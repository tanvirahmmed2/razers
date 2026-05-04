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
        const category_id = parseInt(formData.get('categoryId') || formData.get('category_id'));
        const sub_category_id = null;
        const brand_id = (formData.get('brandId') || formData.get('brand_id')) ? parseInt(formData.get('brandId') || formData.get('brand_id')) : null;
        const unit = formData.get('unit');
        const stock = parseFloat(formData.get('stock')) || 0;
        const purchase_price = parseFloat(formData.get('purchasePrice') || formData.get('purchase_price')) || 0;
        const sale_price = parseFloat(formData.get('salePrice') || formData.get('sale_price')) || 0;
        const discount_price = parseFloat(formData.get('discountPrice') || formData.get('discount_price')) || 0;
        const wholesale_price = parseFloat(formData.get('wholeSalePrice') || formData.get('wholesale_price')) || 0;
        const retail_price = parseFloat(formData.get('retailPrice') || formData.get('retail_price')) || 0;
        const dealer_price = parseFloat(formData.get('dealerPrice') || formData.get('dealer_price')) || 0;
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
                console.log(`Processing ${variants.length} variants for product ${productId}`);
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

                    const vPrice = parseFloat(variant.price) || 0;
                    const vStock = parseFloat(variant.stock) || 0;

                    const variantRes = await client.query(`
                        INSERT INTO ecom_product_variants (product_id, price, stock, image, tenant_id)
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING variant_id
                    `, [productId, vPrice, vStock, variantImageUrl, tenant_id]);
                    
                    const variantId = variantRes.rows[0].variant_id;
                    console.log(`Created variant ${variantId} for product ${productId}`);

                    if (variant.values && Array.isArray(variant.values) && variant.values.length > 0) {
                        for (const valueId of variant.values) {
                            await client.query(`
                                INSERT INTO ecom_variant_combination (product_id, variant_id, variant_value_id, tenant_id)
                                VALUES ($1, $2, $3, $4)
                            `, [productId, variantId, valueId, tenant_id]);
                        }
                        console.log(`Added ${variant.values.length} combinations for variant ${variantId}`);
                    }
                }
            }

            // Fetch the final product with variants to return
            const finalProduct = await client.query(`
                SELECT p.*, c.name as category_name, b.name as brand_name 
                FROM ecom_products p
                LEFT JOIN ecom_categories c ON p.category_id = c.category_id
                LEFT JOIN ecom_brands b ON p.brand_id = b.brand_id
                WHERE p.product_id = $1 AND p.tenant_id = $2
            `, [productId, tenant_id]);

            const finalVariants = await client.query(`
                SELECT 
                    pv.*,
                    COALESCE(JSON_AGG(JSON_BUILD_OBJECT('type', vt.name, 'value', vv.value, 'value_id', vv.variant_value_id)) FILTER (WHERE vc.id IS NOT NULL), '[]'::json) as combinations
                FROM ecom_product_variants pv
                LEFT JOIN ecom_variant_combination vc ON pv.variant_id = vc.variant_id
                LEFT JOIN ecom_variant_values vv ON vc.variant_value_id = vv.variant_value_id
                LEFT JOIN ecom_variant_types vt ON vv.variant_type_id = vt.variant_type_id
                WHERE pv.product_id = $1 AND pv.tenant_id = $2
                GROUP BY pv.variant_id
            `, [productId, tenant_id]);

            const productWithVariants = {
                ...finalProduct.rows[0],
                variants: finalVariants.rows
            };

            await client.query('COMMIT');
            return NextResponse.json({
                success: true, 
                message: `Successfully added product with ${variants.length} variants. Barcode: ${barcode}`,
                payload: productWithVariants
            }, { status: 201 });

        } catch (error) {
            await client.query('ROLLBACK');
            console.error("Product POST Transaction Error:", error);
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error("Product POST API Error:", error);
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
            `SELECT 
                p.*, 
                (SELECT COUNT(*) FROM ecom_product_variants WHERE product_id = p.product_id AND tenant_id = $1) as variant_count,
                (SELECT COALESCE(SUM(stock), 0) FROM ecom_product_variants WHERE product_id = p.product_id AND tenant_id = $1) as total_variant_stock
             FROM ecom_products p 
             WHERE p.tenant_id = $1 
             ORDER BY p.created_at DESC 
             LIMIT $2 OFFSET $3`,
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
        const category_id = parseInt(formData.get('categoryId') || formData.get('category_id'));
        const sub_category_id = null;
        const brand_id = (formData.get('brandId') || formData.get('brand_id')) ? parseInt(formData.get('brandId') || formData.get('brand_id')) : null;
        const barcode = formData.get('barcode');
        const unit = formData.get('unit');
        const stock = parseFloat(formData.get('stock')) || 0;
        const purchase_price = parseFloat(formData.get('purchasePrice') || formData.get('purchase_price')) || 0;
        const sale_price = parseFloat(formData.get('salePrice') || formData.get('sale_price')) || 0;
        const discount_price = parseFloat(formData.get('discountPrice') || formData.get('discount_price')) || 0;
        const wholesale_price = parseFloat(formData.get('wholeSalePrice') || formData.get('wholesale_price')) || 0;
        const retail_price = parseFloat(formData.get('retailPrice') || formData.get('retail_price')) || 0;
        const dealer_price = parseFloat(formData.get('dealerPrice') || formData.get('dealer_price')) || 0;
        
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
                    SET price = $1, stock = $2, image = $3, updated_at = now()
                    WHERE variant_id = $4 AND tenant_id = $5
                `, [v.price, v.stock, vImageUrl, v.variant_id, tenant_id]);

                // Update combinations (Delete and re-insert)
                await client.query("DELETE FROM ecom_variant_combination WHERE variant_id = $1 AND tenant_id = $2", [v.variant_id, tenant_id]);
                if (v.values && v.values.length > 0) {
                    for (const valueId of v.values) {
                        await client.query("INSERT INTO ecom_variant_combination (product_id, variant_id, variant_value_id, tenant_id) VALUES ($1, $2, $3, $4)", [id, v.variant_id, valueId, tenant_id]);
                    }
                }
            } else {
                // Insert
                const newV = await client.query(`
                    INSERT INTO ecom_product_variants (product_id, price, stock, image, tenant_id)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING variant_id
                `, [id, v.price, v.stock, vImageUrl, tenant_id]);
                const newVid = newV.rows[0].variant_id;
                
                if (v.values && v.values.length > 0) {
                    for (const valueId of v.values) {
                        await client.query("INSERT INTO ecom_variant_combination (product_id, variant_id, variant_value_id, tenant_id) VALUES ($1, $2, $3, $4)", [id, newVid, valueId, tenant_id]);
                    }
                }
            }
        }

        // Fetch the final product with variants to return
        const finalProduct = await client.query(`
            SELECT p.*, c.name as category_name, b.name as brand_name 
            FROM ecom_products p
            LEFT JOIN ecom_categories c ON p.category_id = c.category_id
            LEFT JOIN ecom_brands b ON p.brand_id = b.brand_id
            WHERE p.product_id = $1 AND p.tenant_id = $2
        `, [id, tenant_id]);

        const finalVariants = await client.query(`
            SELECT 
                pv.*,
                COALESCE(JSON_AGG(JSON_BUILD_OBJECT('type', vt.name, 'value', vv.value, 'value_id', vv.variant_value_id)) FILTER (WHERE vc.id IS NOT NULL), '[]'::json) as combinations
            FROM ecom_product_variants pv
            LEFT JOIN ecom_variant_combination vc ON pv.variant_id = vc.variant_id
            LEFT JOIN ecom_variant_values vv ON vc.variant_value_id = vv.variant_value_id
            LEFT JOIN ecom_variant_types vt ON vv.variant_type_id = vt.variant_type_id
            WHERE pv.product_id = $1 AND pv.tenant_id = $2
            GROUP BY pv.variant_id
        `, [id, tenant_id]);

        const productWithVariants = {
            ...finalProduct.rows[0],
            variants: finalVariants.rows
        };

        await client.query('COMMIT');
        return NextResponse.json({
            success: true,
            message: 'Successfully updated product and variants',
            payload: productWithVariants
        }, { status: 200 });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Update Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } finally {
        client.release();
    }
}