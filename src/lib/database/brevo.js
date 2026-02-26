import { BrevoClient } from "@getbrevo/brevo";
import { BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME } from "./secret";

// Initialize the client once
const client = new BrevoClient({
    apiKey: BREVO_API_KEY,
});

/**
 * Utility to send transactional emails via Brevo (v4 SDK)
 */
export const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
    try {
        const response = await client.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: htmlContent,
            sender: { 
                name: BREVO_SENDER_NAME, 
                email: BREVO_SENDER_EMAIL 
            },
            to: [{ 
                email: toEmail, 
                name: toName 
            }]
        });

        return { success: true, data: response };
    } catch (error) {
        // Modern SDK errors have better structure
        console.error("Brevo Email Error:", error.message);
        return { success: false, error: error.message };
    }
};