import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const countRes = await pool.query(`SELECT COUNT(*) FROM products WHERE discount_price > 0`);
        const totalItems = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        const data = await pool.query(
            `SELECT * FROM products WHERE discount_price > 0 ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        
        const result = data.rows;

        if (!result || result.length === 0) {
            return NextResponse.json({
                success: false, message: 'No offer data available'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully fetched data', 
            payload: result,
            pagination: { totalPages, currentPage: page }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}