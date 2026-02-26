
import { pool } from "@/lib/database/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/lib/database/brevo"; // Adjusted path to your setup file
import { BASE_URL } from "@/lib/database/secret";

export async function POST(req) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({
                success: false, message: 'Please provide all information'
            }, { status: 400 });
        }

        const existsStaff = await pool.query(`SELECT * FROM staffs WHERE email=$1`, [email]);

        if (existsStaff.rowCount > 0) {
            return NextResponse.json({
                success: false, message: 'Staff already exists with this email'
            }, { status: 400 });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newStaff = await pool.query(
            `INSERT INTO staffs(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *`,
            [name, email, hashPass, role]
        );

        if (newStaff.rowCount === 0) {
            return NextResponse.json({
                success: false, message: 'Failed to add staff'
            }, { status: 400 });
        }

        const emailResult = await sendEmail({
            toEmail: email,
            toName: name,
            subject: "Official Staff Credentials",
            htmlContent: `
                <div style="font-family: 'Helvetica', Arial, sans-serif; padding: 40px; background-color: #ffffff; color: #1a1a1a;">
                    <div style="max-width: 600px; margin: auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 8px;">
                        <h2 style="font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                            Account Activation
                        </h2>
                        <p style="font-size: 14px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
                        <p style="font-size: 14px; line-height: 1.6;">Your professional staff profile has been created. Use the credentials below to access the management dashboard:</p>
                        
                        <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; margin: 25px 0; border-left: 4px solid #000;">
                            <p style="margin: 0; font-size: 13px;"><strong>Login Email:</strong> ${email}</p>
                            <p style="margin: 10px 0 0 0; font-size: 13px;"><strong>Temporary Password:</strong> ${password}</p>
                            <p style="margin: 10px 0 0 0; font-size: 13px;"><strong>Assigned Role:</strong> ${role.toUpperCase()}</p>
                        </div>

                        <p style="font-size: 12px; color: #6b7280; font-style: italic;">Note: For security reasons, please update your password upon first login.</p>
                        
                        <div style="margin-top: 30px;">
                            <a href="${BASE_URL}/login" 
                               style="background-color: #000000; color: #ffffff; padding: 12px 25px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; border-radius: 2px;">
                                Access Dashboard
                            </a>
                        </div>
                    </div>
                </div>`
        });

        if (!emailResult.success) {
            console.error("Staff created, but welcome email failed:", emailResult.error);
        }

        return NextResponse.json({
            success: true, 
            message: 'Successfully added new staff and dispatched credentials'
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false, message: error.message
        }, { status: 500 });
    }
}


export async function GET() {
    try {
        const data= await pool.query(`SELECT * FROM staffs ORDER BY created_at`)
        const result= data.rows
        if(!result || result.length===0){
            return NextResponse.json({
                success:false, message:'No staff found'
            },{status:400})
        }

        return NextResponse.json({
            success:true, message:'Successfully fetched data', payload:result
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
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

        const result = await pool.query(`DELETE FROM staffs WHERE staff_id=$1  RETURNING *`,[id])
        if(result.rowCount===0){
            return NextResponse.json({
                success:false, message:'Failed to delete staff'
            })
        }
        return NextResponse.json({
            success:true, message:'Successfully deleted staff'
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
        
    }
    
}