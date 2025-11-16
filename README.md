# Inspiration

During large-scale emergencies—such as hurricanes, wildfires, floods, and severe storms, 911 dispatch centers are often overwhelmed by massive spikes in calls. People facing life-threatening situations struggle to get through, and dispatchers lack the tools to quickly triage and categorize urgent requests. This bottleneck can cost lives. We wanted to build a system that lightens the load on dispatchers, improves response efficiency, and provides a clearer overview of active emergencies. Our goal: use AI and real-time communication tech to turn chaotic information streams into something structured, actionable, and life-saving.

# What it does

Dispatcher Relays is a real-time emergency intake and triage system powered by SMS + AI.

Here’s how it works:

1. A user texts an emergency message (e.g., “My house is flooding, I'm stuck inside at 453 River Road”).

2. The message is automatically received through Twilio.

3. The backend sends the message to Gemini, which:

    - Extracts key emergency details

    - Classifies the type of incident

    - Identifies whether the user is in immediate danger

    - Attempts to determine location, time, severity, and relevant flags

4. The processed information is stored in Firebase.

5. The front-end dashboard displays:

    - Type of emergency

    - Sender phone number

    - Automatically extracted location

    - Timestamp

    - Message status (pending/completed)

6. Dispatchers can:

    - Sort emergencies by priority fields

    - Mark incidents as complete

    - Send replies directly from the dashboard using Twilio

The result is a clean, AI-powered overview of all emergency messages, allowing dispatchers to react quickly without sifting through raw text.

# How We Built It

We built a dynamic and intuitive frontend with React and TailwindCSS. The Twilio webhook recieves SMS messages, stores it in firebase, Gemini parses each message for relevant information, and displays it on the dashboard
