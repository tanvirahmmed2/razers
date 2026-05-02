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

        const data = await pool.query(`SELECT p.*,c.category_id, c.name as category_name, b.name as brand_name FROM ecom_products p
            LEFT JOIN ecom_categories c ON p.category_id= c.category_id
            LEFT JOIN ecom_brands b on p.brand_id= b.brand_id
            WHERE slug= $1`, [slug])

        const result = data.rows
        if (result.length === 0) {
            return NextResponse.json({
                success: false, message: 'Product not found'
            }, { status: 400 })
        }

        const product = result[0];

        // Fetch Variants
        const variantsRes = await pool.query(`
            SELECT 
                pv.*,
                JSON_AGG(JSON_BUILD_OBJECT('type', vt.name, 'value', vv.value, 'value_id', vv.variant_value_id)) as combinations
            FROM ecom_product_variants pv
            LEFT JOIN ecom_variant_combination vc ON pv.variant_id = vc.variant_id
            LEFT JOIN ecom_variant_values vv ON vc.variant_value_id = vv.variant_value_id
            LEFT JOIN ecom_variant_types vt ON vv.variant_type_id = vt.variant_type_id
            WHERE pv.product_id = $1
            GROUP BY pv.variant_id
        `, [product.product_id]);

        product.variants = variantsRes.rows;

        return NextResponse.json({
            success: true, message: 'Successfully fetched data', payload: result
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}