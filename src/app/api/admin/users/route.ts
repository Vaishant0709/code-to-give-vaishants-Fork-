import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


export async function GET(request : NextRequest){
  try {
    // const session = await getServerSession(authOptions);
    // if(!session || session.user.role !=='admin'){
    //   return NextResponse.json(
    //     {error : "Unauthorized . Only admins can access this"},
    //     {status:401}
    //   );
    // }

    await dbConnect();

    const page=parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit= parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const roleParam=request.nextUrl.searchParams.get('role');

    const query: {role : {$in : string[] } | string} = {
      role: {$in : ['student','teacher']}
    };

    if(roleParam==='student' || roleParam==='teacher'){
      query.role = roleParam;
    }

    const users=await User.find(query)
    .select('-password')
    .sort({createdAt : -1})
    .skip((page-1)*limit)
    .limit(limit)
    .lean()

    const total=await User.countDocuments(query);

    return NextResponse.json(
      {users,
        pagination:{
          currentPage:page,
          totalPages : Math.ceil(total/limit),
          totalUsers:total
        }
      },
      {status:200}
    );
      
    }
   catch (error) {
    console.log(`ERROR :: USER FETCH ERROR :: ${error}`);
    return NextResponse.json(
      {error:'Internal Server Error'},
      {status:500}
    );
    
  }
}