import cloudinary from "@/lib/database/cloudinary";
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function POST(req) {
    try {
        const formData = await req.formData();
        
        const name = formData.get("name");
        const description = formData.get('description');
        const category_id = parseInt(formData.get('categoryId'));
        const brand_id = formData.get('brandId') ? parseInt(formData.get('brandId')) : null;
        
        // We use 'let' because we might modify this variable
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

        // VALIDATION: Removed !barcode from this check
        if (!name || !category_id || !unit || isNaN(purchase_price) || isNaN(sale_price)) {
            return NextResponse.json({
                success: false, message: 'Please provide all required fields'
            }, { status: 400 });
        }

        // AUTO-GENERATE BARCODE LOGIC
        if (!barcode || barcode.trim() === '') {
            // Find the highest numeric barcode currently in the database
            // The regex ~ '^[0-9]+$' ensures we ignore barcodes like "ABC-123"
            const maxBarcodeResult = await pool.query(`
                SELECT MAX(CAST(barcode AS BIGINT)) as max_code 
                FROM products 
                WHERE barcode ~ '^[0-9]+$'
            `);
            
            const maxCode = maxBarcodeResult.rows[0]?.max_code;

            if (maxCode) {
                // Increment the highest found number
                barcode = (Number(maxCode) + 1).toString();
            } else {
                // If no numeric barcodes exist yet, start at 10001
                barcode = "10001";
            }
        }

        const slug = slugify(name.trim(), { lower: true, strict: true });

        // CHECK DUPLICATES (now checks the provided OR generated barcode)
        const isExists = await pool.query(`SELECT product_id FROM products WHERE slug=$1 OR barcode=$2`, [slug, barcode]);
        if (isExists.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Product name or Barcode already exists'
            }, { status: 400 });
        }

        if (!imageFile) {
            return NextResponse.json({ success: false, message: 'Please add image' }, { status: 400 });
        }

        // Cloudinary Upload
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const cloudImage = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "nizamvarietiesstore" },
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
            stream.end(imageBuffer);
        });

        // Insert into DB
        const query = `
            INSERT INTO products (
                name, description, category_id, brand_id, slug, barcode, unit, 
                stock, purchase_price, sale_price, discount_price, 
                wholesale_price, retail_price, dealer_price, image, image_id
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
            RETURNING *`;

        const values = [
            name, description, category_id, brand_id, slug, barcode, unit,
            stock, purchase_price, sale_price, discount_price,
            wholesale_price, retail_price, dealer_price, 
            cloudImage.secure_url, cloudImage.public_id
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
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const countRes = await pool.query("SELECT COUNT(*) FROM products");
        const totalItems = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalItems / limit);

        const data = await pool.query(
            `SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
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
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID not received" },
                { status: 400 }
            );
        }

        const { rows } = await pool.query(`SELECT * FROM products WHERE product_id = $1`, [id]);
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
            `DELETE FROM products WHERE product_id = $1 RETURNING *`,
            [id]
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
        const formData = await req.formData();
        const id = formData.get("id");
        const name = formData.get("name");

        if (!id) {
            return NextResponse.json({ success: false, message: 'Product ID is required' }, { status: 400 });
        }

        // 1. Basic Fields Parsing
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
        
        // Only generate slug if name is provided
        const slug = name ? slugify(name.trim(), { lower: true, strict: true }) : null;

        // 2. Image Handling Logic
        const imageFile = formData.get("image");
        let imageUrl = null;
        let imagePublicId = null;

        // Only upload to Cloudinary if a new file (not a string/URL) is provided
        if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "nizam_store_products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            imageUrl = uploadResponse.secure_url;
            imagePublicId = uploadResponse.public_id;
        }

        // 3. Construct the SQL Query
        // Values 1 through 14 are standard fields
        let query = `
            UPDATE products 
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

        // 4. Conditional Image Update
        if (imageUrl) {
            // If new image exists, we append it to the SET clause
            query += `, image = $15, image_id = $16 WHERE product_id = $17`;
            values.push(imageUrl, imagePublicId, id);
        } else {
            // If no new image, we skip those columns entirely
            query += ` WHERE product_id = $15`;
            values.push(id);
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