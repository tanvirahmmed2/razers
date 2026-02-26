import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@/lib/database/secret";

const TWENTY_YEARS = 60 * 60 * 24 * 365 * 20;

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // 1. Validate Input
        const existsUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
        if (existsUser.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 400 });
        }

        const user = existsUser.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 400 });
        }

        const token = jwt.sign(
            { user_id: user.user_id, email: user.email, phone:user.phone },
            JWT_SECRET,
            { expiresIn: "20y" }
        );

        const response = NextResponse.json({
            success: true,
            message: "Successfully logged in",
            payload: { name: user.name, email: user.email }
        }, { status: 200 });

        response.cookies.set("nvs_user_token", token, {
            httpOnly: true, // Prevents JS access (XSS protection)
            path: "/",      // Essential: makes cookie available to all pages
            maxAge: TWENTY_YEARS, 
            sameSite: "lax", // Better for local dev than 'strict'
            // Only use secure (HTTPS) in production
            secure: process.env.NODE_ENV === "production", 
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}




export async function GET() {

    try {
        const res = NextResponse.json({
        success: true,
        message: "Logout successful",
    });


    res.cookies.set("nvs_user_token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return res;
    } catch (error) {
        return NextResponse.json({
            success:false,
            message: "failed to logout",
            error: error.message
        }, {status:500})
    }
}
