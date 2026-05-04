import { pool } from "@/lib/database/db";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const website = await getTenant();
        if (!website) {
            return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const { searchParams } = new URL(req.url);
        const category_id = searchParams.get('category');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        let query = `SELECT * FROM ecom_products WHERE tenant_id = $1`;
        let countQuery = `SELECT COUNT(*) FROM ecom_products WHERE tenant_id = $1`;
        let values = [tenant_id];

        if (category_id && category_id !== '') {
            query += ` AND category_id = $2`;
            countQuery += ` AND category_id = $2`;
            values.push(category_id);
        }

        const totalRes = await pool.query(countQuery, values);
        const totalItems = parseInt(totalRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        const finalValues = [...values, limit, offset];

        const data = await pool.query(query, finalValues);
        const result = data.rows;

        return NextResponse.json({
            success: true,
            message: result.length > 0 ? 'Successfully fetched data' : 'No product found',
            payload: result,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Filter API Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}