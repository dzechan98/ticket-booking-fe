import { BaseResponse } from "@/types/common";

export enum Gender {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
}

export interface UserResponse extends BaseResponse {
  full_name: string | null;
  email: string;
  is_admin: boolean;
  avatar: string | null;
  dob: string | null;
  gender: Gender | null;
}
