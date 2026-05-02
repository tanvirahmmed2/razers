import { pool } from "@/lib/database/db";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const website = await getTenant();
        if (!website) return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 404 });
        
        const res = await pool.query(`
            SELECT vv.*, vt.name as type_name 
            FROM ecom_variant_values vv
            JOIN ecom_variant_types vt ON vv.variant_type_id = vt.variant_type_id
            WHERE vv.tenant_id = $1
        `, [website.tenant_id]);
        return NextResponse.json({ success: true, payload: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const website = await getTenant();
        if (!website) return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 404 });
        
        const { type_id, value } = await req.json();
        const res = await pool.query(
            "INSERT INTO ecom_variant_values (variant_type_id, value, tenant_id) VALUES ($1, $2, $3) RETURNING *",
            [type_id, value, website.tenant_id]
        );
        return NextResponse.json({ success: true, payload: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
