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
        const sub_category_id = formData.get('subCategoryId') ? parseInt(formData.get('subCategoryId')) : null;
        const brand_id = formData.get('brandId') ? parseInt(formData.get('brandId')) : null;
        const unit = formData.get('unit');
        const stock = parseFloat(formData.get('stock')) || 0;
        const purchase_price = parseFloat(formData.get('purchasePrice')) || 0;
        const sale_price = parseFloat(formData.get('salePrice')) || 0;
        const discount_price = parseFloat(formData.get('discountPrice')) || 0;
        const wholesale_price = parseFloat(formData.get('wholeSalePrice')) || 0;
        const retail_price = parseFloat(formData.get('retailPrice')) || 0;
        const dealer_price = parseFloat(formData.get('dealerPrice')) || 0;
        const imageFile = formData.get('image');

        if (!name || !category_id || !unit || isNaN(purchase_price) || isNaN(sale_price)) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }

        let barcode = formData.get('barcode');
        if (!barcode || barcode.trim() === '') {
            const maxBarcodeResult = await pool.query(`
                SELECT MAX(CAST(barcode AS BIGINT)) as max_code 
                FROM ecom_products 
                WHERE barcode ~ '^[0-9]+$' AND tenant_id = $1
            `, [tenant_id]);
            const maxCode = maxBarcodeResult.rows[0]?.max_code;
            barcode = maxCode ? (Number(maxCode) + 1).toString() : "10001";
        }

        const variantsData = formData.get('variants');
        const variants = variantsData ? JSON.parse(variantsData) : [];

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const slug = slugify(name.trim(), { lower: true, strict: true });

            const isExists = await client.query(
                `SELECT product_id FROM ecom_products WHERE (slug=$1 OR barcode=$2) AND tenant_id = $3`, 
                [slug, barcode, tenant_id]
            );
            if (isExists.rowCount > 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ success: false, message: 'Product name or Barcode already exists' }, { status: 400 });
            }

            if (!imageFile) {
                await client.query('ROLLBACK');
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
                    name, description, category_id, sub_category_id, brand_id, slug, barcode, unit, 
                    stock, purchase_price, sale_price, discount_price, 
                    wholesale_price, retail_price, dealer_price, image, image_id, tenant_id
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) 
                RETURNING product_id`;

            const values = [
                name, description, category_id, sub_category_id, brand_id, slug, barcode, unit,
                stock, purchase_price, sale_price, discount_price,
                wholesale_price, retail_price, dealer_price, 
                cloudImage.secure_url, cloudImage.public_id, tenant_id
            ];

            const newProduct = await client.query(query, values);
            const productId = newProduct.rows[0].product_id;

            // Handle Variants
            if (variants && variants.length > 0) {
                for (let i = 0; i < variants.length; i++) {
                    const variant = variants[i];
                    let variantImageUrl = null;
                    
                    const variantImageFile = formData.get(`variantImage_${i}`);
                    if (variantImageFile && typeof variantImageFile !== 'string') {
                        const vBuffer = Buffer.from(await variantImageFile.arrayBuffer());
                        const vCloud = await new Promise((resolve, reject) => {
                            const vStream = cloudinary.uploader.upload_stream(
                                { folder: `tenant_${tenant_id}/variants` },
                                (err, result) => {
                                    if (err) reject(err);
                                    else resolve(result);
                                }
                            );
                            vStream.end(vBuffer);
                        });
                        variantImageUrl = vCloud.secure_url;
                    }

                    const variantRes = await client.query(`
                        INSERT INTO ecom_product_variants (product_id, sku, price, stock, image, tenant_id)
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING variant_id
                    `, [productId, variant.sku, variant.price, variant.stock, variantImageUrl, tenant_id]);
                    
                    const variantId = variantRes.rows[0].variant_id;

                    if (variant.values && variant.values.length > 0) {
                        for (const valueId of variant.values) {
                            await client.query(`
                                INSERT INTO ecom_variant_combination (variant_id, variant_value_id, tenant_id)
                                VALUES ($1, $2, $3)
                            `, [variantId, valueId, tenant_id]);
                        }
                    }
                }
            }

            await client.query('COMMIT');
            return NextResponse.json({
                success: true, message: `Successfully added product with ${variants.length} variants. Barcode: ${barcode}`
            }, { status: 201 });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
    const client = await pool.connect();
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
        const sub_category_id = formData.get('sub_category_id') ? parseInt(formData.get('sub_category_id')) : null;
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
        
        const variantsData = formData.get('variants');
        const variants = variantsData ? JSON.parse(variantsData) : [];

        await client.query('BEGIN');

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
                sub_category_id = $4,
                brand_id = $5, 
                slug = COALESCE($6, slug), 
                barcode = $7, 
                unit = $8, 
                stock = $9, 
                purchase_price = $10, 
                sale_price = $11, 
                discount_price = $12, 
                wholesale_price = $13, 
                retail_price = $14, 
                dealer_price = $15
        `;

        const values = [
            name, description, category_id, sub_category_id, brand_id, slug, barcode, unit,
            stock, purchase_price, sale_price, discount_price,
            wholesale_price, retail_price, dealer_price
        ];

        if (imageUrl) {
            query += `, image = $16, image_id = $17 WHERE product_id = $18 AND tenant_id = $19`;
            values.push(imageUrl, imagePublicId, id, tenant_id);
        } else {
            query += ` WHERE product_id = $16 AND tenant_id = $17`;
            values.push(id, tenant_id);
        }

        const updatedProduct = await client.query(query + " RETURNING *", values);

        if (updatedProduct.rowCount === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
        }

        // --- Variant Sync Logic ---
        const currentVariants = await client.query("SELECT variant_id FROM ecom_product_variants WHERE product_id = $1 AND tenant_id = $2", [id, tenant_id]);
        const currentVariantIds = currentVariants.rows.map(r => r.variant_id);
        const incomingVariantIds = variants.filter(v => v.variant_id).map(v => v.variant_id);

        // 1. Delete removed variants
        const toDelete = currentVariantIds.filter(vid => !incomingVariantIds.includes(vid));
        for (const vid of toDelete) {
            // Check if variant is in orders before deleting
            const orderCheck = await client.query("SELECT order_item_id FROM ecom_order_items WHERE variant_id = $1 LIMIT 1", [vid]);
            if (orderCheck.rowCount === 0) {
                await client.query("DELETE FROM ecom_product_variants WHERE variant_id = $1 AND tenant_id = $2", [vid, tenant_id]);
            }
        }

        // 2. Update/Insert variants
        for (let i = 0; i < variants.length; i++) {
            const v = variants[i];
            let vImageUrl = v.image;

            // Handle variant image upload if a file is provided
            const vImageFile = formData.get(`variantImage_${i}`);
            if (vImageFile && typeof vImageFile !== 'string') {
                const vBuffer = Buffer.from(await vImageFile.arrayBuffer());
                const vCloud = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: `tenant_${tenant_id}/variants` },
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        }
                    ).end(vBuffer);
                });
                vImageUrl = vCloud.secure_url;
            }

            if (v.variant_id) {
                // Update
                await client.query(`
                    UPDATE ecom_product_variants 
                    SET sku = $1, price = $2, stock = $3, image = $4, updated_at = now()
                    WHERE variant_id = $5 AND tenant_id = $6
                `, [v.sku, v.price, v.stock, vImageUrl, v.variant_id, tenant_id]);

                // Update combinations (Delete and re-insert)
                await client.query("DELETE FROM ecom_variant_combination WHERE variant_id = $1 AND tenant_id = $2", [v.variant_id, tenant_id]);
                if (v.values && v.values.length > 0) {
                    for (const valueId of v.values) {
                        await client.query("INSERT INTO ecom_variant_combination (variant_id, variant_value_id, tenant_id) VALUES ($1, $2, $3)", [v.variant_id, valueId, tenant_id]);
                    }
                }
            } else {
                // Insert
                const newV = await client.query(`
                    INSERT INTO ecom_product_variants (product_id, sku, price, stock, image, tenant_id)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING variant_id
                `, [id, v.sku, v.price, v.stock, vImageUrl, tenant_id]);
                const newVid = newV.rows[0].variant_id;
                
                if (v.values && v.values.length > 0) {
                    for (const valueId of v.values) {
                        await client.query("INSERT INTO ecom_variant_combination (variant_id, variant_value_id, tenant_id) VALUES ($1, $2, $3)", [newVid, valueId, tenant_id]);
                    }
                }
            }
        }

        await client.query('COMMIT');
        return NextResponse.json({
            success: true,
            message: 'Successfully updated product and variants',
            payload: updatedProduct.rows[0]
        }, { status: 200 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}