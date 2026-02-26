import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";

export async function GET() {
    const client = await pool.connect();
    try {
        // 1. Sales Stats Query
        const salesStatsQuery = `
            SELECT 
                COALESCE(SUM(CASE WHEN created_at::date = CURRENT_DATE THEN total_amount ELSE 0 END), 0)::FLOAT as today,
                COALESCE(SUM(CASE WHEN created_at::date = CURRENT_DATE - 1 THEN total_amount ELSE 0 END), 0)::FLOAT as yesterday,
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN total_amount ELSE 0 END), 0)::FLOAT as last_week,
                COALESCE(SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '1 year' THEN total_amount ELSE 0 END), 0)::FLOAT as last_year
            FROM orders WHERE status = 'completed';
        `;

        // 2. Finance Query (FIXED: Removed 'FROM products' to ensure 1 row always returns)
        const financeQuery = `
            SELECT 
                (SELECT COALESCE(SUM(stock * purchase_price), 0)::FLOAT FROM products) as stock_valuation,
                (SELECT COALESCE(SUM(total_amount), 0)::FLOAT FROM orders WHERE status = 'completed') as total_sales,
                (SELECT COALESCE(SUM(total_amount), 0)::FLOAT FROM purchases) as total_purchases_cost,
                (SELECT COALESCE(SUM(amount_paid), 0)::FLOAT FROM purchase_payments) as cash_outflow
        `;

        // 3. Chart Query
        const chartQuery = `
            SELECT 
                to_char(d.day, 'DD Mon') as date,
                COALESCE(SUM(o.total_amount), 0)::FLOAT as amount,
                COALESCE((SELECT SUM(total_amount) FROM purchases WHERE created_at::date = d.day), 0)::FLOAT as purchase_amount
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') d(day)
            LEFT JOIN orders o ON o.created_at::date = d.day AND o.status = 'completed'
            GROUP BY d.day
            ORDER BY d.day ASC;
        `;

        const [sales, finance, chart] = await Promise.all([
            client.query(salesStatsQuery),
            client.query(financeQuery),
            client.query(chartQuery)
        ]);

        // Fallback object if the row is somehow missing
        const stats = finance.rows[0] || {
            total_sales: 0,
            cash_outflow: 0,
            total_purchases_cost: 0,
            stock_valuation: 0
        };

        const netCashFlow = (stats.total_sales || 0) - (stats.cash_outflow || 0);

        return NextResponse.json({
            success: true,
            payload: {
                sales: sales.rows[0] || { today: 0, yesterday: 0, last_week: 0, last_year: 0 },
                finance: {
                    total_invested: stats.total_purchases_cost,
                    total_earned: stats.total_sales,
                    net_cash: netCashFlow,
                    current_stock_value: stats.stock_valuation
                },
                chartData: chart.rows
            }
        });
    } catch (error) {
        console.error("Advanced Analytics Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}