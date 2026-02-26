import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";

        let query = `
            SELECT *
            FROM products
        `;
        const values = [];

        if (q) {
            query += `
              WHERE (COALESCE(name, '') ILIKE $1 
                 OR COALESCE(barcode, '') ILIKE $1)
         `;
            values.push(`%${q}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT 10`;

        const data = await pool.query(query, values);
        const result = data.rows
        // if (q.length<1 || result.length === 0) {
        //     return NextResponse.json({
        //         success: false, message: 'No product found'
        //     }, { status: 400 })
        // }

        return NextResponse.json(
            { success: true, message: 'Successfully fetched data', payload: result },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
