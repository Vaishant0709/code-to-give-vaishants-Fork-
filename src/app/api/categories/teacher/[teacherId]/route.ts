import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
//GETTING ALL CATEGORIES OF A SPECIFIC TEACHER 
//AUTH IS NOT WORKING REST OF THE API IS WORKING

export async function GET(request : NextRequest,{params}:{params : {teacherId : string}}){
  try {
    // const session = await getServerSession(authOptions);

    // if(!session || session.user.role !=='teacher'){
    //   return NextResponse.json(
    //     {error : "Unauthorized"},
    //     {status : 401}
    //   );
    // }
    const {teacherId}=await params;
    await dbConnect();
    const categories= (await Category.find({teacher :teacherId}).sort({deadline : 1}))

    return NextResponse.json(
      {categories},
      {status:200}
    );

  } catch (error) {
    console.log(`ERROR :: CATEGORY FETCH ERROR :: ${error}`);
    return NextResponse.json(
      {error : 'Internal Server Error'},
      {status : 500}
    );
    
  }
}