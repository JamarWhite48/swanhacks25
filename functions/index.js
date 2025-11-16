import * as functions from "firebase-functions";
import twilio from "twilio";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const { GEMINI_KEY, TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = process.env;

export const sendSMS = functions.https.onRequest(async (req, res) => {
    try {
        // Create Twilio client
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);

        // Get data from request body
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: "Missing 'to' or 'message' in request body" });
        }

        // Send SMS
        const sentMessage = await client.messages.create({
            body: message,
            to: to,
            from: TWILIO_NUMBER,
        });

        return res.json({ success: true, sid: sentMessage.sid });
    } catch (err) {
        console.error("Error sending SMS:", err);
        return res.status(500).json({ error: err.message });
    }
});
