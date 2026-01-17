export enum ErrorCodeMessage {
  INVALID_CREDENTIALS = "Invalid email or password",
  EMAIL_ALREADY_REGISTERED = "Email already registered",
}

export const ERROR_CODE_MESSAGE_MAP: Record<ErrorCodeMessage, string> = {
  [ErrorCodeMessage.INVALID_CREDENTIALS]: "Email hoặc mật khẩu không đúng",
  [ErrorCodeMessage.EMAIL_ALREADY_REGISTERED]: "Email đã được đăng ký",
};
