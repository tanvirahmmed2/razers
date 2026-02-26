import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "./database/secret";
import { pool } from "./database/db";

async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies(); 
        const token = cookieStore.get('nvs_user_token')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const res = await pool.query(
            `SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = $1`, 
            [decoded.user_id]
        );

        return res.rows[0] || null;
    } catch (error) {
        return null;
    }
}

export async function isUserLogin() {
    const user = await getAuthenticatedUser();
    
    if (!user) {
        return { 
            success: false, 
            message: 'Authentication required. Please login.' 
        };
    }

    return { 
        success: true, 
        payload: user 
    };
}