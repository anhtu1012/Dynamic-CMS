"use client";

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
import { useRegister } from "./_hooks/useRegister";
import { RegisterRequest } from "@/lib/schemas/auth/auth.request";
import Link from "next/link";

export default function Register() {
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      firstName: "",
      lastName: "",
    } as RegisterRequest,
    onSubmit: async ({ value }) => {
      registerMutation.mutate(value);
    },
  });

  return (
    <div className="w-full h-full flex items-center justify-center">
      
      <Card className="w-full max-w-md relative z-10 bg-slate-950/30 backdrop-blur-md border-slate-800/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Create an account</CardTitle>
          <CardDescription className="text-slate-300">
            Enter your information to create an account
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
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }) =>
                      value.length < 1
                        ? "First name is required"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className="text-slate-200">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
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
                  name="lastName"
                  validators={{
                    onChange: ({ value }) =>
                      value.length < 1
                        ? "Last name is required"
                        : undefined,
                  }}
                >
                  {(field) => (
                    <div className="grid gap-2">
                      <Label htmlFor="lastName" className="text-slate-200">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
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
              </div>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) =>
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                      ? "Invalid email address"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-200">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
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
                name="userName"
                validators={{
                  onChange: ({ value }) =>
                    value.length < 3
                      ? "Username must be at least 3 characters"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="userName" className="text-slate-200">Username</Label>
                    <Input
                      id="userName"
                      placeholder="johndoe"
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
                      ? "Password must be at least 6 characters"
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-200">Password</Label>
                    <Input
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
            disabled={registerMutation.isPending}
            onClick={() => form.handleSubmit()}
          >
            {registerMutation.isPending ? "Creating account..." : "Create account"}
          </Button>
          <div className="mt-4 text-center text-sm text-slate-300">
            Already have an account?{" "}
            <Link href="/login" className="underline text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
