import { BaseResponse } from "@/types/common";

export interface UserResponse extends BaseResponse {
  full_name: string | null;
  email: string;
  is_admin: boolean;
  avatar: string | null;
}
