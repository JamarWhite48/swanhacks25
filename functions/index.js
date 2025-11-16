// ----------------------------------------------------
// Load environment variables first
// ----------------------------------------------------
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ----------------------------------------------------
// Imports
// ----------------------------------------------------
import * as functions from "firebase-functions";
import admin from "firebase-admin";
import twilio from "twilio";
import fetch from "node-fetch";

// ----------------------------------------------------
// Extract environment variables
// ----------------------------------------------------
const { GEMINI_KEY, TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = process.env;

// ----------------------------------------------------
// Initialize Firebase Admin
// ----------------------------------------------------
admin.initializeApp();

// ----------------------------------------------------
// Gemini AI Analysis (with logs)
// ----------------------------------------------------
async function analyzeWithGemini(text) {
    console.log("[analyzeWithGemini] Starting analysis");
    console.log("Input text:", text);

    try {
        const url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=" +
            GEMINI_KEY;

        console.log("Sending request to Gemini API");

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `
Analyze this emergency message and extract:
- Severity
- Summary
- Location details
- Urgency level

Message: ${text}
                `,
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await response.json();
        console.log("[analyzeWithGemini] Gemini response:", data);

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No analysis returned"
        );
    } catch (err) {
        console.error("[analyzeWithGemini] Error:", err);
        return "AI analysis failed.";
    }
}

// ----------------------------------------------------
// POST /sendSMS - Manual SMS sending
// ----------------------------------------------------
export const sendSMS = functions.https.onRequest(async (req, res) => {
    console.log("[sendSMS] Function triggered");
    console.log("Incoming body:", req.body);

    try {
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);

        const { to, message } = req.body;

        if (!to || !message) {
            console.log("[sendSMS] Missing fields");
            return res.status(400).json({ error: "Missing 'to' or 'message'" });
        }

        console.log("Sending SMS to:", to);

        const sent = await client.messages.create({
            body: message,
            from: TWILIO_NUMBER,
            to,
        });

        console.log("SMS sent. SID:", sent.sid);

        return res.json({ success: true, sid: sent.sid });
    } catch (err) {
        console.error("[sendSMS] Error sending SMS:", err);
        return res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// POST /receiveSMS - Twilio webhook
// ----------------------------------------------------
export const receiveSMS = functions.https.onRequest(async (req, res) => {
    try {
        const from = req.body.From || "";
        const body = req.body.Body || "";
        const time = new Date().toISOString();

        console.log("[receiveSMS] Function triggered");
        console.log("[receiveSMS] Raw request body:", req.body);
        console.log("[receiveSMS] Extracted From:", from);
        console.log("[receiveSMS] Extracted Body:", body);

        // Optional: Gemini analysis (skip for now if key/API not enabled)
        const analysis = "TEST ANALYSIS";

        // Push to Realtime Database (Dashboard listens here)
        await admin.database().ref("alerts").push({
            from: from,
            message: body,
            analysis: analysis,
            timestamp: Date.now()
        });

        console.log("[receiveSMS] Saved message to RTDB:", body);

        // Respond to Twilio
        res.set("Content-Type", "text/xml");
        return res.send("<Response></Response>");
    } catch (err) {
        console.error("[receiveSMS] Error:", err);
        return res.status(500).send("Server Error");
    }
});

