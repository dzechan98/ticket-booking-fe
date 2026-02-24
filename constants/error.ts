export enum ErrorCodeMessage {
  INVALID_CREDENTIALS = "Invalid email or password",
  EMAIL_ALREADY_REGISTERED = "Email already registered",
  ROOM_BOOKED = "Room is already booked for this time period",
  USER_EXISTS = "User with this email already exists",
}

export const ERROR_CODE_MESSAGE_MAP: Record<ErrorCodeMessage, string> = {
  [ErrorCodeMessage.INVALID_CREDENTIALS]: "Email hoặc mật khẩu không đúng",
  [ErrorCodeMessage.EMAIL_ALREADY_REGISTERED]: "Email đã được đăng ký",
  [ErrorCodeMessage.ROOM_BOOKED]:
    "Phòng đã được đặt trong khoảng thời gian này",
  [ErrorCodeMessage.USER_EXISTS]: "Người dùng với email này đã tồn tại",
};
