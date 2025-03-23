import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { hash } from "bcrypt";
import formSchema from "@/lib/schemas/signup";
import { MongooseError } from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = formSchema.parse(await req.json());
    const { password } = data;
    const user = await User.create({
      ...data,
      password: await hash(password, parseInt(process.env.SALT_ROUNDS || "10")),
    });
    return Response.json({ success: true, data: user });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    let errorMsg = "Could not create account";
    if (error["name"] === "ZodError") {
      errorMsg = error["issues"][0]["message"];
    } else if (error instanceof MongooseError) {
      errorMsg = error.message;
    }
    return Response.json({ success: false, error: errorMsg });
  }
}
