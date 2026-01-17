import { ERROR_CODE_MESSAGE_MAP, ErrorCodeMessage } from "@/constants/error";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const serverMessage = (error.response?.data?.error ||
      error.response?.data?.message) as ErrorCodeMessage;

    if (serverMessage && ERROR_CODE_MESSAGE_MAP[serverMessage]) {
      return ERROR_CODE_MESSAGE_MAP[serverMessage];
    }

    return serverMessage || "Đã có lỗi xảy ra";
  }

  return "Đã có lỗi xảy ra";
};
