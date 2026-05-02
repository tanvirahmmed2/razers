import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { getTenant } from "@/lib/database/tenant";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req) {
    try {
        const website = await getTenant();
        if (!website) {
            return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const formData = await req.formData();
        
        const name = formData.get("name");
        const description = formData.get('description');
        const category_id = parseInt(formData.get('categoryId'));
        const brand_id = formData.get('brandId') ? parseInt(formData.get('brandId')) : null;
        
        let barcode = formData.get('barcode');
        
        const unit = formData.get('unit');
        const stock = parseInt(formData.get('stock')) || 0;
        
        const purchase_price = parseFloat(formData.get('purchasePrice'));
        const sale_price = parseFloat(formData.get('salePrice'));
        const discount_price = parseFloat(formData.get('discountPrice')) || 0;
        const wholesale_price = parseFloat(formData.get('wholeSalePrice'));
        const retail_price = parseFloat(formData.get('retailPrice')) || 0;
        const dealer_price = parseFloat(formData.get('dealerPrice')) || 0;

        const imageFile = formData.get('image');

        if (!name || !category_id || !unit || isNaN(purchase_price) || isNaN(sale_price)) {
            return NextResponse.json({
                success: false, message: 'Please provide all required fields'
            }, { status: 400 });
        }

        if (!barcode || barcode.trim() === '') {
            const maxBarcodeResult = await pool.query(`
                SELECT MAX(CAST(barcode AS BIGINT)) as max_code 
                FROM ecom_products 
                WHERE barcode ~ '^[0-9]+$' AND tenant_id = $1
            `, [tenant_id]);
            
            const maxCode = maxBarcodeResult.rows[0]?.max_code;

            if (maxCode) {
                barcode = (Number(maxCode) + 1).toString();
            } else {
                barcode = "10001";
            }
        }

        const slug = slugify(name.trim(), { lower: true, strict: true });

        const isExists = await pool.query(
            `SELECT product_id FROM ecom_products WHERE (slug=$1 OR barcode=$2) AND tenant_id = $3`, 
            [slug, barcode, tenant_id]
        );
        if (isExists.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Product name or Barcode already exists'
            }, { status: 400 });
        }

        if (!imageFile) {
            return NextResponse.json({ success: false, message: 'Please add image' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: `tenant_${tenant_id}` },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        const query = `
            INSERT INTO ecom_products (
                name, description, category_id, brand_id, slug, barcode, unit, 
                stock, purchase_price, sale_price, discount_price, 
                wholesale_price, retail_price, dealer_price, image, image_id, tenant_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
            RETURNING *`;

        const values = [
            name, description, category_id, brand_id, slug, barcode, unit,
            stock, purchase_price, sale_price, discount_price,
            wholesale_price, retail_price, dealer_price, 
            cloudImage.secure_url, cloudImage.public_id, tenant_id
        ];

        const newProduct = await pool.query(query, values);

        if (newProduct.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to add product'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true, message: `Successfully added product. Barcode: ${barcode}`
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message 
        }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const website = await getTenant();
        if (!website) {
            return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const countRes = await pool.query("SELECT COUNT(*) FROM ecom_products WHERE tenant_id = $1", [tenant_id]);
        const totalItems = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        const data = await pool.query(
            `SELECT * FROM ecom_products WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
            [tenant_id, limit, offset]
        );

        const result = data.rows;

        if (!result || result.length === 0) {
            return NextResponse.json({
                success: false, 
                message: 'No product found'
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully fetched data',
            payload: result,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, 
            message: error.message
        }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const website = await getTenant();
        if (!website) {
            return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID not received" },
                { status: 400 }
            );
        }

        const { rows } = await pool.query(`SELECT * FROM ecom_products WHERE product_id = $1 AND tenant_id = $2`, [id, tenant_id]);
        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: "No product found with this ID" },
                { status: 404 }
            );
        }

        const product = rows[0];

        const deleteImage = await cloudinary.uploader.destroy(product.image_id);
        if (deleteImage.result !== "ok" && deleteImage.result !== "not found") {
            return NextResponse.json(
                { success: false, message: "Could not delete image from Cloudinary" },
                { status: 500 }
            );
        }

        const deleteProduct = await pool.query(
            `DELETE FROM ecom_products WHERE product_id = $1 AND tenant_id = $2 RETURNING *`,
            [id, tenant_id]
        );

        if (deleteProduct.rowCount === 0) {
            return NextResponse.json(
                { success: false, message: "Failed to delete product" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Successfully deleted product" },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const website = await getTenant();
        if (!website) {
            return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const formData = await req.formData();
        const id = formData.get("id");
        const name = formData.get("name");

        if (!id) {
            return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
        }

        const description = formData.get('description');
        const category_id = parseInt(formData.get('category_id'));
        const brand_id = formData.get('brand_id') ? parseInt(formData.get('brand_id')) : null;
        const barcode = formData.get('barcode');
        const unit = formData.get('unit');
        const stock = parseFloat(formData.get('stock')) || 0;
        const purchase_price = parseFloat(formData.get('purchase_price')) || 0;
        const sale_price = parseFloat(formData.get('sale_price')) || 0;
        const discount_price = parseFloat(formData.get('discount_price')) || 0;
        const wholesale_price = parseFloat(formData.get('wholesale_price')) || 0;
        const retail_price = parseFloat(formData.get('retail_price')) || 0;
        const dealer_price = parseFloat(formData.get('dealer_price')) || 0;
        
        const slug = name ? slugify(name.trim(), { lower: true, strict: true }) : null;

        const imageFile = formData.get("image");
        let imageUrl = null;
        let imagePublicId = null;

        if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: `tenant_${tenant_id}` },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadResponse.secure_url;
            imagePublicId = uploadResponse.public_id;
        }

        let query = `
            UPDATE ecom_products 
            SET 
                name = COALESCE($1, name), 
                description = $2, 
                category_id = $3, 
                brand_id = $4, 
                slug = COALESCE($5, slug), 
                barcode = $6, 
                unit = $7, 
                stock = $8, 
                purchase_price = $9, 
                sale_price = $10, 
                discount_price = $11, 
                wholesale_price = $12, 
                retail_price = $13, 
                dealer_price = $14
        `;

        const values = [
            name, description, category_id, brand_id, slug, barcode, unit,
            stock, purchase_price, sale_price, discount_price,
            wholesale_price, retail_price, dealer_price
        ];

        if (imageUrl) {
            query += `, image = $15, image_id = $16 WHERE product_id = $17 AND tenant_id = $18`;
            values.push(imageUrl, imagePublicId, id, tenant_id);
        } else {
            query += ` WHERE product_id = $15 AND tenant_id = $16`;
            values.push(id, tenant_id);
        }

        const updatedProduct = await pool.query(query + " RETURNING *", values);

        if (updatedProduct.rowCount === 0) {
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Successfully updated product',
            payload: updatedProduct.rows[0]
        }, { status: 200 });

    } catch (error) {
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}