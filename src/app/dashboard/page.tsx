"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  console.log("SESSION:", session);
  return <>{JSON.stringify(session?.user)}</>;
}
