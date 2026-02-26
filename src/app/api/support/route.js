import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";



export async function POST(req) {
    try {
        const { name, email, subject, message } = await req.json()

        if (!name || !email || !subject || !message) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 })
        }

        const newSupport = await pool.query(`INSERT INTO supports(name,email,subject,message) VALUES($1, $2, $3, $4) RETURNING *`, [name, email, subject, message])

        if (newSupport.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to send message'
            }, { status: 400 })
        }
        return NextResponse.json({
            success: false, message: 'Successfully send message'
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}


export async function GET() {
    try {
        const data= await pool.query(`SELECT * FROM supports ORDER BY created_at DESC`)
        const result= data.rows

        if(!result || result.length===0){
            return NextResponse.json({
                success:false, message:'No data found'
            },{status:400})
        }

        return NextResponse.json({
            success:false, message:'Successfully fetched data', payload:result
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 })

    }

}


export async function DELETE(req) {
    try {
        const {id}= await req.json()
        if(!id){
            return NextResponse.json({
                success:false, message:'ID not recieved'
            },{status:400})
        }
        const result= await pool.query(`DELETE FROM supports WHERE support_id=$1 RETURNING *`, [id])
        if(result.rowCount===0){
            return NextResponse.json({
                success:false, message:'Failed to remove message'
            },{status:400})
        }

         return NextResponse.json({
            success:true, message:'Successfully deleted message'
         },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
}