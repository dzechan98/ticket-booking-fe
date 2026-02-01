export enum ErrorCodeMessage {
  INVALID_CREDENTIALS = "Invalid email or password",
  EMAIL_ALREADY_REGISTERED = "Email already registered",
  ROOM_BOOKED = "Room is already booked for this time period",
}

export const ERROR_CODE_MESSAGE_MAP: Record<ErrorCodeMessage, string> = {
  [ErrorCodeMessage.INVALID_CREDENTIALS]: "Email hoặc mật khẩu không đúng",
  [ErrorCodeMessage.EMAIL_ALREADY_REGISTERED]: "Email đã được đăng ký",
  [ErrorCodeMessage.ROOM_BOOKED]:
    "Phòng đã được đặt trong khoảng thời gian này",
};
