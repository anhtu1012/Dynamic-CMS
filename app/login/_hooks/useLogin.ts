/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthServices from "@/services/auth/api.service";
import { setAuthData } from "@/redux/store/slices/loginSlice";
import { setCookie } from "@/utils/client/getCookie";
import { UserRequestLoginItem } from "@/lib/schemas/auth/auth.request";
import { LoginResponse } from "@/lib/schemas/auth/auth.response";

export function useLogin() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (
      formData: UserRequestLoginItem
    ): Promise<LoginResponse> => {
      return await AuthServices.login(formData);
    },
    onSuccess: (data) => {
      // Lưu thông tin vào Redux store
      dispatch(
        setAuthData({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userProfile: data.userProfile,
        })
      );

      // Lưu token vào cookie sử dụng helper project
      try {
        setCookie("accessToken", data.accessToken, 7); // expires in 7 days
        setCookie("refreshToken", data.refreshToken, 30); // expires in 30 days
      } catch {
        try {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
        } catch {
          // ignore
        }
      }

      toast.success("Đăng nhập thành công!");

      // Redirect to database selection page
      router.push("/databases");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại!");
    },
  });
}
