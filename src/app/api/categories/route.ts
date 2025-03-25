import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server";
import { categoryValidationSchema } from "@/lib/schemas/categoryCreation";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";


export async function POST(request: NextRequest) {
  try {

    //AUTH IS NOT WORKING REST OF THE API IS WORKING


    // const session=await getServerSession(authOptions)
    // console.log("session :- ",session);
    // console.log("Request headers:", request.headers);
    // console.log("Cookies:", request.cookies);

    // if(!session){
    //   return NextResponse.json(
    //     {error : "Unauthorized"},
    //     {status:401}
    //   );
    // }

    // if(session.user.role!=='teacher'){
    //   return NextResponse.json(
    //     {error : 'Only Teacher can create category'},
    //     {status:403}
    //   );
    // }
    


    const body = await request.json();
    const validation = categoryValidationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      );
    }

    await dbConnect();
    console.log(request);
    
    const newCategory = await Category.create({
      ...validation.data,
      teacher: '67e281083d7225e91fe1973e',
      deadline: new Date(validation.data.deadline),
      submissions: [],
      createdAt : new Date(),
      updatedAt : new Date()
    });


    return NextResponse.json(
      { message: "Category Created ", category: newCategory },
      { status: 201 }
    );

  } catch (error) {
    console.log(`ERROR :: CATEGORY CREATION ERROR :: ${error}`);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );

  }
}

export async function GET(request : NextRequest){
  try {
    // const session = await getServerSession(authOptions);

    // if(!session || session.user.role !=='teacher'){
    //   return NextResponse.json(
    //     {error : "Unauthorized"},
    //     {status : 401}
    //   );
    // }

    await dbConnect();

    const categories= (await Category.find({teacher :'67e281083d7225e91fe1973e'}).sort({deadline : 1}))

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