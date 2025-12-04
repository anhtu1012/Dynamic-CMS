"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { useLogin } from "./_hooks/useLogin";
import { UserRequestLoginItem } from "@/lib/schemas/auth/auth.request";

export default function Login() {
  const loginMutation = useLogin();

  const form = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    } as UserRequestLoginItem,
    onSubmit: async ({ value }) => {
      loginMutation.mutate(value);
    },
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      
      <Card className="w-full max-w-sm relative z-10 bg-slate-950/30 backdrop-blur-md border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
          <CardDescription className="text-slate-300">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <form.Field
                name="emailOrUsername"
                validators={{
                  onChange: ({ value }) =>
                    value.length < 4
                      ? "Email hoặc username phải có ít nhất 4 ký tự"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="emailOrUsername" className="text-slate-200">Email hoặc Username</Label>
                    <Input
                      tabIndex={1}
                      id="emailOrUsername"
                      type="text"
                      placeholder="m@example.com hoặc username"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                )}
              </form.Field>
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    value.length < 6
                      ? "Mật khẩu phải có ít nhất 6 ký tự"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password" className="text-slate-200">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-400 hover:text-blue-300"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      tabIndex={2}
                      id="password"
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <span className="text-sm text-red-400">
                        {field.state.meta.errors[0]}
                      </span>
                    )}
                  </div>
                )}
              </form.Field>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
            disabled={loginMutation.isPending}
            onClick={() => form.handleSubmit()}
          >
            {loginMutation.isPending ? "Đang đăng nhập..." : "Login"}
          </Button>
          {/* <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Login with Google
          </Button> */}
          <div className="mt-4 text-center text-sm text-slate-300">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
