import React from 'react'
import ProductDetails from '@/components/page/ProductDetails'
import SameCategory from '@/components/page/SameCategory'
import { getTenant } from '@/lib/database/tenant'
import { pool } from '@/lib/database/db'

const SingleProduct = async ({ params }) => {
  const { slug } = await params
  const website = await getTenant()
  
  if (!website) return <div>Store not found</div>
  const tenant_id = website.tenant_id

  const productRes = await pool.query(`
      SELECT p.*, c.category_id, c.name as category_name, b.name as brand_name 
      FROM ecom_products p
      LEFT JOIN ecom_categories c ON p.category_id = c.category_id
      LEFT JOIN ecom_brands b ON p.brand_id = b.brand_id
      WHERE p.slug = $1 AND p.tenant_id = $2
  `, [slug, tenant_id]);

  let product = productRes.rows[0];

  if (product) {
      const variantsRes = await pool.query(`
          SELECT 
              pv.*,
              COALESCE(JSON_AGG(JSON_BUILD_OBJECT('type', vt.name, 'value', vv.value, 'value_id', vv.variant_value_id)) FILTER (WHERE vc.id IS NOT NULL), '[]'::json) as combinations
          FROM ecom_product_variants pv
          LEFT JOIN ecom_variant_combination vc ON pv.variant_id = vc.variant_id
          LEFT JOIN ecom_variant_values vv ON vc.variant_value_id = vv.variant_value_id
          LEFT JOIN ecom_variant_types vt ON vv.variant_type_id = vt.variant_type_id
          WHERE pv.product_id = $1 AND pv.tenant_id = $2
          GROUP BY pv.variant_id
      `, [product.product_id, tenant_id]);
      product.variants = variantsRes.rows;
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-sm text-slate-400">The product you are looking for does not exist for this store.</p>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen flex flex-col gap-20 items-center justify-center rounded-2xl'>
      <ProductDetails product={product} />
      <SameCategory category={product?.category_id} />
    </div>
  )
}

export default SingleProduct
