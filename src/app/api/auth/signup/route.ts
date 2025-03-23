import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { hash } from "bcrypt";
import formSchema from "@/lib/schemas/signup";

export async function POST(req: Request) {
  await dbConnect();
  const data = await req.json();
  try {
    formSchema.parse(data);
    const { email, password } = data;
    const user = await User.create({
      email: email,
      password: await hash(password, parseInt(process.env.SALT_ROUNDS || "10")),
    });
    return Response.json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, error: error });
  }
}
