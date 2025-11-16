// ----------------------------------------------------
// Load environment variables BEFORE anything else
// ----------------------------------------------------
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ----------------------------------------------------
// Imports AFTER dotenv loads
// ----------------------------------------------------
import * as functions from "firebase-functions";
import twilio from "twilio";
import fetch from "node-fetch";
import admin from "firebase-admin";

// Extract env variables
const { GEMINI_KEY, TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = process.env;

// ----------------------------------------------------
// Initialize Firebase Admin
// ----------------------------------------------------
admin.initializeApp();
// ----------------------------------------------------
// Gemini AI Analysis
// ----------------------------------------------------
async function analyzeWithGemini(text) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${GEMINI_KEY}`;

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
- Urgency level (urgent vs non-urgent)

Message: ${text}
                `
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI returned no analysis"
        );
    } catch (err) {
        console.error("Gemini request error:", err);
        return "AI analysis failed.";
    }
}

// ----------------------------------------------------
// HTTPS function — manually send SMS
// ----------------------------------------------------
export const sendSMS = functions.https.onRequest(async (req, res) => {
    try {
        const client = twilio(TWILIO_SID, TWILIO_TOKEN);
        const { to, message } = req.body;

        if (!to || !message) {
            return res.status(400).json({ error: "Missing 'to' or 'message'" });
        }

        const sent = await client.messages.create({
            body: message,
            from: TWILIO_NUMBER,
            to
        });

        return res.json({ success: true, sid: sent.sid });
    } catch (err) {
        console.error("Twilio send error:", err);
        return res.status(500).json({ error: err.message });
    }
});

// ----------------------------------------------------
// Twilio Webhook — Receive SMS
// ----------------------------------------------------
export const receiveSMS = functions.https.onRequest(async (req, res) => {
    try {
        const { From, Body } = req.body;

        console.log("📩 Incoming:", From, Body);

        // 1. Get AI analysis
        const analysis = await analyzeWithGemini(Body);

        // 2. Store alert in Firebase
        await admin.database().ref("alerts").push({
            from: From,
            message: Body,
            analysis,
            timestamp: Date.now()
        });

        // Twilio requires XML response
        res.set("Content-Type", "text/xml");
        return res.send("<Response></Response>");
    } catch (err) {
        console.error("Webhook error:", err);
        return res.status(500).send("Server Error");
    }
});
