import { isAdmin } from "@/lib/middleware";
import { pool } from "@/lib/database/pg";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        // Fetch full website data from the websites table
        const res = await pool.query("SELECT * FROM public.websites LIMIT 1");

        if (res.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Website not found" }, { status: 404 });
        }

        const payload = {
            ...res.rows[0],
            subscription_status: 'active',
            subscription_expires_at: null,
            tenant_status: 'active'
        };

        return NextResponse.json({ success: true, payload });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const auth = await isAdmin();
        if (!auth.success) {
            return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
        }

        const data = await req.json();

        // Whitelist of fields allowed to be updated
        const allowedFields = [
            'name', 'business_name', 'email', 'phone', 'address', 'city', 'country',
            'logo', 'favicon', 'meta_title', 'meta_description',
            'facebook', 'instagram', 'linkedin', 'youtube',
            'primary_color', 'secondary_color', 'is_public', 'is_store_enabled'
        ];

        const updates = [];
        const values = [];
        let index = 1;

        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates.push(`${field} = $${index}`);
                values.push(data[field]);
                index++;
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ success: false, message: "No fields to update" }, { status: 400 });
        }

        const query = `
            UPDATE public.websites 
            SET ${updates.join(', ')}, updated_at = now()
            WHERE website_id = (SELECT website_id FROM public.websites LIMIT 1)
            RETURNING *
        `;

        const res = await pool.query(query, values);

        return NextResponse.json({
            success: true,
            message: "Website settings updated successfully",
            payload: res.rows[0]
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
