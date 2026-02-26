import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !phone || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const client = await pool.connect();
        try {
            const query = `
                INSERT INTO users (name, email, phone, password)
                VALUES ($1, $2, $3, $4)
                RETURNING user_id, name, email;
            `;
            const values = [name, email, phone, hashedPassword];
            const result = await client.query(query, values);

            return NextResponse.json({
                message: "User registered successfully",
                user: result.rows[0]
            }, { status: 201 });

        } catch (err) {
            if (err.code === '23505') { 
                return NextResponse.json({ message: "Email or Phone already exists" }, { status: 409 });
            }
            throw err;
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { user_id, name, phone, email } = await req.json();
        const client = await pool.connect();

        try {
            const query = `
                UPDATE users 
                SET name = $1, phone = $2, email = $3
                WHERE user_id = $4
                RETURNING user_id, name, email, phone;
            `;
            const result = await client.query(query, [name, phone, email, user_id]);

            if (result.rowCount === 0) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Profile updated", user: result.rows[0] });
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('id');

        const client = await pool.connect();
        try {
            const result = await client.query("DELETE FROM users WHERE user_id = $1", [user_id]);
            
            if (result.rowCount === 0) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            return NextResponse.json({ message: "Account deleted successfully" });
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}