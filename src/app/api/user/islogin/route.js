import { isUserLogin } from "@/lib/usermiddleware";
import { NextResponse } from "next/server";

export async function GET(params) {
    try {
        const auth= await isUserLogin()
        if(!auth.success){
            return NextResponse.json({
                success:false, message:auth.message
            },{status:400})
        }

        return NextResponse.json({
            success:true, message:'authentication successfull',payload:auth.payload
        },{status:200})

    } catch (error) {
        
        return NextResponse.json({
            success:false, message:error.message
        },{status:500})
    }
    
}