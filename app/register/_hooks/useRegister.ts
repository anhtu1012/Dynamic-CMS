/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthServices from "@/services/auth/api.service";
import { RegisterRequest } from "@/lib/schemas/auth/auth.request";
import { RegisterResponse } from "@/lib/schemas/auth/auth.response";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      formData: RegisterRequest
    ): Promise<RegisterResponse> => {
      return await AuthServices.register(formData);
    },
    onSuccess: () => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
    },
  });
}
