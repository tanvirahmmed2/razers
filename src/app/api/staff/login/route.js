import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 });
        }

        const existsStaff = await pool.query(`SELECT * FROM staffs WHERE email=$1`, [email]);

        if (existsStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Staff not found with this email'
            }, { status: 400 });
        }

        const user = existsStaff.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({
                success: false, message: 'Incorrect password'
            }, { status: 400 });
        }

        const payload = { 
            id: user.staff_id, 
            email: user.email, 
            role: user.role 
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        const { password: _, ...userData } = user;

        const response = NextResponse.json(
            {
                success: true,
                message: "Successfully logged in",
                payload: userData,
            },
            { status: 200 }
        );

        response.cookies.set("user_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}


export async function GET() {

    try {
        const res = NextResponse.json({
        success: true,
        message: "Logout successful",
    });


    res.cookies.set("user_token", "", {
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
