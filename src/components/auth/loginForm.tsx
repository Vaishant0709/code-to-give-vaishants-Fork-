"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import formSchema from "@/lib/schemas/signin";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterForm({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await signIn("credentials", {
      ...values,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    setLoading(false);
  }
  useEffect(() => {
    if (params.get("msg")) toast.success(params.get("msg"));
    if (params.get("error") === "CredentialsSignin") toast.error("Incorrect email or password");
  }, [params]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link className="underline" href={"/register"}>
                  Register
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
