import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/database/brevo";

export async function POST(req) {
    try {
        const { email } = await req.json();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60000); // 15 Mins

        const res = await pool.query(
            `UPDATE staffs SET password_otp = $1, otp_expires_at = $2 WHERE email = $3 RETURNING name`,
            [otp, expiry, email]
        );

        if (res.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });
        }

        await sendEmail({
            toEmail: email,
            toName: res.rows[0].name,
            subject: "Your Password Reset Code",
            htmlContent: `<div style="font-family:sans-serif; padding:20px; border:1px solid #eee;">
                <h3>Reset Code</h3>
                <p>Hello ${res.rows[0].name}, use the code below to reset your password:</p>
                <h1 style="letter-spacing:10px; background:#f4f4f4; padding:10px; text-align:center;">${otp}</h1>
                <p>This expires in 15 minutes.</p>
            </div>`
        });

        return NextResponse.json({ success: true, message: "OTP sent" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}