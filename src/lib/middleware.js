import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { JWT_SECRET } from "./database/secret";
import { pool } from "./database/db";

async function getAuthenticatedUser() {
    try {
        const cookieStore = await cookies(); 
        const token = cookieStore.get('user_token')?.value;

        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET);
        
        const res = await pool.query(
            `SELECT staff_id, name, email, role FROM staffs WHERE staff_id = $1`, 
            [decoded.id]
        );

        return res.rows[0] || null;
    } catch (error) {
        return null;
    }
}

export async function isLogin() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    return { success: true, payload: user };
}

export async function isManager() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'manager') {
        return { success: false, message: 'Access denied: Managers only' };
    }
    return { success: true, payload: user };
}

export async function isSales() {
    const user = await getAuthenticatedUser();
    if (!user) return { success: false, message: 'Please login' };
    
    if (user.role !== 'sales') {
        return { success: false, message: 'Access denied: Sales staff only' };
    }
    return { success: true, payload: user };
}