import { pool } from '@/lib/database/db'
import { getTenant } from '@/lib/database/tenant';
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const website = await getTenant();
    if (!website) {
      return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
    }
    const tenant_id = website.tenant_id;

    const { name } = await req.json()

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Please add category name' },
        { status: 400 }
      )
    }

    const existCat = await pool.query(
      'SELECT 1 FROM ecom_categories WHERE name = $1 AND tenant_id = $2',
      [name.trim(), tenant_id]
    )

    if (existCat.rowCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Category already exists' },
        { status: 409 }
      )
    }

    const newCat = await pool.query(
      'INSERT INTO ecom_categories(name, tenant_id) VALUES($1, $2) RETURNING *',
      [name.trim(), tenant_id]
    )

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added category',
        data: newCat.rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
    try {
        const website = await getTenant();
        if (!website) {
          return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const data = await pool.query(
            'SELECT * FROM ecom_categories WHERE tenant_id = $1 ORDER BY created_at DESC',
            [tenant_id]
        )
        const result = data.rows

        if (!result || result.length === 0) {
            return NextResponse.json({
                success: false, message: 'No category found'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully fetched data', payload: result
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const website = await getTenant();
        if (!website) {
          return NextResponse.json({ success: false, message: 'Website/Tenant not found' }, { status: 404 });
        }
        const tenant_id = website.tenant_id;

        const { id } = await req.json()
        if (!id) {
            return NextResponse.json({
                success: false, message: 'ID not recieved'
            }, { status: 400 })
        }
        const result = await pool.query(
            `DELETE FROM ecom_categories WHERE category_id = $1 AND tenant_id = $2 RETURNING *`, 
            [id, tenant_id]
        )

        if (result.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to delete category'
            }, { status: 400 })
        }

        return NextResponse.json({
            success: true, message: 'Successfully deleted category'
        }, { status: 200 })
        
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })
    }
}