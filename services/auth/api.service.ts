import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";
import {
  RegisterRequest,
  RegisterRequestSchema,
  UserRequestLoginItem,
  UserRequestLoginSchema,
} from "@/lib/schemas/auth/auth.request";
import {
  LoginResponse,
  RegisterResponse,
} from "@/lib/schemas/auth/auth.response";

class AuthServicesBase extends AxiosService {
  protected readonly basePath = "/auth";

  async login(formData: UserRequestLoginItem): Promise<LoginResponse> {
    await ValidateBaseClass.validate(formData, UserRequestLoginSchema);
    return this.post(`${this.basePath}/login`, formData);
  }

  async register(formData: RegisterRequest): Promise<RegisterResponse> {
    await ValidateBaseClass.validate(formData, RegisterRequestSchema);
    return this.post(`${this.basePath}/register`, formData);
  }

  // async logout(token: string): Promise<UserResponseLogoutItem> {
  //   return this.post(`${this.basePath}/logout`, { token: token });
  // }

  async forgotPassword(userId: string, newPassword: string): Promise<void> {
    return this.put(`/v1/sa/user/password/${userId}`, {
      password: newPassword,
    });
  }
}

const AuthServices = new AuthServicesBase();
export default AuthServices;
