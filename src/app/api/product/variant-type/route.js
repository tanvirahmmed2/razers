import { pool } from "@/lib/database/db";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const website = await getTenant();
        if (!website) return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 404 });
        
        const res = await pool.query("SELECT * FROM ecom_variant_types WHERE tenant_id = $1", [website.tenant_id]);
        return NextResponse.json({ success: true, payload: res.rows });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const website = await getTenant();
        if (!website) return NextResponse.json({ success: false, message: 'Tenant not found' }, { status: 404 });
        
        const { name } = await req.json();
        const res = await pool.query(
            "INSERT INTO ecom_variant_types (name, tenant_id) VALUES ($1, $2) RETURNING *",
            [name, website.tenant_id]
        );
        return NextResponse.json({ success: true, payload: res.rows[0] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
