import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('q') || ''; 

    try {
        const query = `
            SELECT 
                c.name,
                c.phone,
                o.order_id,
                o.total_amount,
                o.total_discount_amount,
                o.subtotal_amount,
                o.status,
                p.payment_status,
                p.change_amount,
                p.amount_received AS paid_amount,
                o.created_at,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'name', pr.name, 
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'sale_price', pr.sale_price, 
                        'discount_price', pr.discount_price,
                        'barcode', pr.barcode
                    )
                ) AS items
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
            JOIN payments p ON o.order_id = p.order_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products pr ON oi.product_id = pr.product_id
            WHERE o.status = 'completed' AND (
                c.phone ILIKE $1 OR 
                c.name ILIKE $1 OR 
                pr.name ILIKE $1 OR 
                pr.barcode = $2 OR 
                CAST(o.order_id AS TEXT) = $2 OR
                CAST(o.created_at AS TEXT) ILIKE $1
            )
            GROUP BY 
                o.order_id, 
                c.name, 
                c.phone, 
                o.total_amount,
                o.total_discount_amount,
                o.subtotal_amount,
                o.status,
                p.payment_status, 
                p.change_amount, 
                p.amount_received,
                o.created_at
            ORDER BY o.created_at DESC
        `;

        const data = await pool.query(query, [`%${searchTerm}%`, searchTerm]);
        const result = data.rows;

        if (result.length === 0) {
            return NextResponse.json({
                success: false, 
                message: 'No completed orders found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            payload: result
        }, { status: 200 });

    } catch (error) {
        console.error("Search Error:", error.message);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}