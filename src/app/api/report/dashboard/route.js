import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'Today';
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    try {
        // 1. LIFETIME OVERVIEW (9 Cards)
        const overviewQuery = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM customers) as total_customers,
                (SELECT COUNT(*) FROM products) as total_products,
                (SELECT COALESCE(SUM(stock), 0) FROM products) as total_stock_qty,
                (SELECT COALESCE(SUM(stock * purchase_price), 0) FROM products) as total_stock_value,
                (SELECT COUNT(*) FROM orders WHERE status = 'completed') as total_confirmed_orders,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'completed') as total_sales_amount,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status = 'returned') as total_returned_amount,
                (SELECT COUNT(*) FROM purchases) as total_purchase_count,
                (SELECT COALESCE(SUM(total_amount), 0) FROM purchases) as total_purchase_amount,
                -- Lifetime Profit
                (SELECT COALESCE(SUM((oi.price - p.purchase_price) * oi.quantity), 0) 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.product_id 
                 JOIN orders o ON oi.order_id = o.order_id 
                 WHERE o.status = 'completed') as total_profit_amount
        `);

        // 2. DYNAMIC FILTER LOGIC
        let dateFilter = "";
        let params = [];

        if (type === 'Custom' && start && end) {
            dateFilter = "o.created_at::date >= $1 AND o.created_at::date <= $2";
            params = [start, end];
        } else {
            const ranges = {
                'Today': "o.created_at::date = CURRENT_DATE",
                'Yesterday': "o.created_at::date = CURRENT_DATE - 1",
                'This Week': "o.created_at::date >= date_trunc('week', CURRENT_DATE)",
                'This Month': "o.created_at::date >= date_trunc('month', CURRENT_DATE)",
                'This Year': "o.created_at::date >= date_trunc('year', CURRENT_DATE)"
            };
            dateFilter = ranges[type] || ranges['Today'];
        }

        const purchaseFilter = dateFilter.replace(/o\.created_at/g, 'p.created_at');

        // 3. PERIOD STATS
        const rangeStats = await pool.query(`
            SELECT 
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders o 
                 WHERE status = 'completed' AND ${dateFilter}) as sales,
                (SELECT COALESCE(SUM(total_amount), 0) FROM orders o 
                 WHERE status = 'returned' AND ${dateFilter}) as returns,
                (SELECT COALESCE(SUM(total_amount), 0) FROM purchases p 
                 WHERE ${purchaseFilter}) as purchases,
                (SELECT COALESCE(SUM((oi.price - pr.purchase_price) * oi.quantity), 0)
                 FROM order_items oi
                 JOIN products pr ON oi.product_id = pr.product_id
                 JOIN orders o ON oi.order_id = o.order_id
                 WHERE o.status = 'completed' AND ${dateFilter}) as profit
        `, params);

        return NextResponse.json({
            success: true,
            overview: overviewQuery.rows[0],
            activeRange: rangeStats.rows[0]
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}