🚀 Relay: AI Crisis Triage Dashboard

The Pitch: In a crisis, community organizers are flooded with chaotic messages. Relay is an AI-powered triage system that turns this chaos into an actionable, real-time dashboard. We turn a feed of panic into a plan of action.

Theme: Software for Social Good

🛠️ Tech Stack

Frontend: React.js

Backend: Firebase Cloud Functions (Node.js)

Database: Firebase Realtime Database (for live-syncing)

Hosting: Firebase Hosting

APIs:

Twilio API: To receive SMS messages from a real phone number.

Google's Gemini API: For AI-powered text parsing and classification.

Google Maps API: (Stretch Goal) To visualize request locations.

🌊 How It Works (Core Data Flow)

A person in need sends an SMS: Help! My basement is flooding at 123 Main Street and I need sandbags!

Twilio receives the SMS and sends a webhook (an HTTP request) to our backend.

Our Firebase Cloud Function (the backend) receives the text.

The Cloud Function sends the raw text to the Gemini API with a special prompt.

Gemini API returns a structured JSON object:

{
"type": "Need",
"item": "Sandbags",
"location": "123 Main Street",
"summary": "User at 123 Main St needs sandbags for flooding.",
"urgency": "High",
"status": "Pending"
}


The Cloud Function saves this clean JSON object to the Firebase Realtime Database.

The React Dashboard (listening to the database) updates instantly, showing a new card on the screen for an organizer to see. No refresh needed.

🏁 24-Hour Hackathon Build Plan (Step-by-Step)

Phase 0: Setup & "Hello World" (The Foundation)

[ ] Team: Assign roles:

Frontend Lead: (Manages the React dashboard)

Backend Lead: (Manages Firebase Functions & API integrations)

[ ] Git: Create the GitHub repo and invite all team members.

[ ] Firebase Project:

[ ] Create one single Firebase project (it's free).

[ ] Enable Realtime Database (start in "test mode" for the hackathon - read: true, write: true).

[ ] Enable Hosting.

[ ] Enable Cloud Functions (select Node.js).

[ ] Google Cloud APIs:

[ ] In the Google Cloud console (linked to your Firebase project), enable the Gemini API (it might be under "Vertex AI" or "AI Platform").

[ ] Enable the Google Maps JavaScript API (for the stretch goal).

[ ] Get your Google Cloud API Key (for Gemini & Maps).

[ ] Twilio Account:

[ ] Sign up for a free trial account.

[ ] Get your free Twilio Phone Number.

[ ] Find your Twilio Account SID and Auth Token.

[ ] Local Project Setup:

[ ] npm install -g firebase-tools (if you don't have it).

[ ] firebase login

[ ] firebase init (in the root of your repo). Select Functions, Hosting, and Realtime Database.

[ ] cd functions and npm install firebase-admin firebase-functions @google/generative-ai twilio

[ ] npx create-react-app dashboard (or client) in the root.

[ ] cd dashboard and npm install firebase react-google-maps (for the stretch goal).

Phase 1: The AI "Brain" (The Backend Cloud Function)

[ ] 1. Write the Function: Go to functions/index.js.

[ ] 2. Create an HTTP Trigger: Write a Cloud Function that responds to HTTP requests (functions.https.onRequest). This will be your Twilio webhook.

[See: https://firebase.google.com/docs/functions/http-events ]

[ ] 3. Parse the Twilio Request: Inside the function, get the Body (the text message) from the request.body.

[ ] 4. Call Gemini API:

[ ] Initialize the Google Generative AI client with your API key.

[ ] Write a strong prompt: "You are a crisis triage assistant. Parse the following text and respond *only* with a JSON object... [add example]"

[ ] Send the Body to Gemini.

[ ] Get the (stringified) JSON response back from Gemini.

[ ] 5. Save to Database:

[ ] JSON.parse() the Gemini response.

[ ] Add a timestamp: receivedAt: Date.now()

[ ] Initialize the firebase-admin app.

[ ] Get a reference to the Realtime Database and push() the new JSON object to a collection (e.g., /requests).

[ ] 6. Deploy & Link:

[ ] firebase deploy --only functions

[ ] Get the public URL for your function.

[ ] CRITICAL: Paste this URL into your Twilio Phone Number's webhook field for "A MESSAGE COMES IN".

[ ] 7. Test: Send a text to your Twilio number. Go to the Firebase console and watch the Realtime Database. Does a new JSON entry appear? If yes, Phase 1 is complete!

Phase 2: The Real-Time Dashboard (The React Frontend)

[ ] 1. Configure Firebase: Create a firebaseConfig.js file in your dashboard app. Paste in the frontend Firebase config object from your Firebase project settings.

[ ] 2. Connect to Database:

[ ] In App.js, import your Firebase config and get a reference to the Realtime Database.

[ ] Use a useEffect hook to run code on component mount.

[ ] Use the onValue() function (from firebase/database) to listen to your /requests collection.

[See: https://firebase.google.com/docs/database/web/read-and-write#read_data_once_with_an_observer ]

[ ] 3. Manage State:

[ ] Create a React state: const [requests, setRequests] = useState({}).

[ ] Inside onValue(), call setRequests(data.val()) to update your state live.

[ ] 4. Render the UI:

[ ] In your JSX, Object.values(requests).map(...) to loop through all the request objects.

[ ] Create a <RequestCard> component that takes a request object as a prop.

[ ] Render the type, summary, location, and status in the card.

[ ] Add some basic CSS (flexbox, grid) to make it look clean.

[ ] 5. Test (The Magic Moment):

[ ] Run your React app (npm start).

[ ] Send a new text to your Twilio number.

[ ] Watch your dashboard. Does a new card pop up without you refreshing the page? If yes, your core demo is complete!

Phase 3: Deploy & Present

[ ] 1. Configure Hosting: In firebase.json (in your root folder), set the hosting.public property to "dashboard/build".

[ ] 2. Build React App: In the dashboard folder, run npm run build.

[ ] 3. Deploy!: From the root folder, run firebase deploy --only hosting.

[ ] 4. Test Live: Get your public Firebase Hosting URL. Test the entire flow.

[ ] 5. Prepare Pitch: Build your presentation around the "chaos vs. calm" story.

⭐ Stretch Goals (If You Have Time)

[ ] Map View:

[ ] Add a react-google-maps component to your dashboard.

[ ] Pass your requests object to it.

[ ] Loop through and add a <Marker> for each request at its location. (You may need to geocode this, or just show the ones the Maps API can understand).

[ ] Bonus: Color-code pins: red for "Need", green for "Offer".

[ ] Status Toggles:

[ ] Add buttons ("Pending", "In Progress", "Complete") to your <RequestCard>.

[ ] On click, update that request's status in the Realtime Database. The change will sync for everyone.

[ ] SMS Auto-Reply:

[ ] In your Phase 1 Cloud Function, after saving to the database, use the Twilio client to send a reply SMS.

[ ] client.messages.create({ body: 'Your request for ' + item + ' has been received.', from: twilioNumber, to: userNumber })

[ ] AI Summary:

[ ] Add a "Get Summary" button to your React app.

[ ] On click, trigger a new Cloud Function.

[ ] That function reads all requests from the database, sends them to Gemini, and asks, "What are the top 3 most urgent needs?"

🔑 API Key & Secret Management (CRITICAL!)

DO NOT COMMIT API KEYS TO GITHUB.

For Firebase Cloud Functions (Backend):

Use Firebase Functions config.

firebase functions:config:set twilio.sid="YOUR_SID" twilio.token="YOUR_TOKEN" gemini.key="YOUR_KEY"

In your index.js, access them with functions.config().twilio.sid.

For React App (Frontend):

Only the Google Maps API key is needed on the frontend (and your Firebase config, which is safe).

Create a .env file in your dashboard folder.

Add REACT_APP_GOOGLE_MAPS_KEY=YOUR_KEY

Access it in your code with process.env.REACT_APP_GOOGLE_MAPS_KEY.

Add .env to your .gitignore file.