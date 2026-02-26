import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";



export async function GET(req, { params }) {
    try {
        const { slug } = await params
        if (!slug) {
            return NextResponse.json({
                success: false, message: 'Slug not recieved'
            }, { status: 400 })
        }

        const data = await pool.query(`SELECT p.*,c.category_id, c.name as category_name, b.name as brand_name FROM products p
            LEFT JOIN categories c ON p.category_id= c.category_id
            LEFT JOIN brands b on p.brand_id= b.brand_id
            WHERE slug= $1`, [slug])


        const result = data.rows
        if (result.length === 0) {
            return NextResponse.json({
                success: false, message: 'Product not found'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true, message: 'Successfully fetched data', payload: result
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}