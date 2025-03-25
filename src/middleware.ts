// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// import { JWT } from "next-auth/jwt";interface CustomToken extends JWT {
//   role?:'teacher' | 'student' | 'admin' ;
// }


// export async function middleware(request : NextRequest){
//   const token=await getToken({req:request}) as CustomToken | null ;
//   const path=request.nextUrl.pathname;

//   const teacherRoutes=[
//     '/api/categories',
//     '/api/categories/submissions'
//   ];

//   const isTeacherRoute=teacherRoutes.some(route=> path.startsWith(route));

//   if(isTeacherRoute){
//     if(!token || token.role!=='teacher'){
//       return NextResponse.json(
//         {error : "unauthorized in middleware"},
//         {status : 401}
//       );
//     }
//   }

//   return NextResponse.next();


 




export { default } from "next-auth/middleware";
export const config = { matcher: [
  "/dashboard",
  // "/api/categories/:path*",
  // "/api/categories/submissions/:path*"
  ] 
};

