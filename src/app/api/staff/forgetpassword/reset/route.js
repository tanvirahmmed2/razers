import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, otp, newPassword } = await req.json();

        const user = await pool.query(
            "SELECT * FROM staffs WHERE email = $1 AND password_otp = $2 AND otp_expires_at > CURRENT_TIMESTAMP",
            [email, otp]
        );

        if (user.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Invalid or expired OTP" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE staffs SET password = $1, password_otp = NULL, otp_expires_at = NULL WHERE email = $2",
            [hashed, email]
        );

        return NextResponse.json({ success: true, message: "Password updated" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}