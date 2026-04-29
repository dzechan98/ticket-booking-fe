import { Gender } from "@/api/users/type";
import { ShowtimeStatus } from "@/api/showtimes/type";
import { SeatType } from "@/api/seats/type";
import { ScreenType } from "@/api/rooms/type";

/**
 * Screen Type Labels (Loại màn hình)
 */
export const screenTypeLabels: Record<ScreenType, string> = {
  [ScreenType.STANDARD]: "Tiêu chuẩn",
  [ScreenType.IMAX]: "IMAX",
  [ScreenType.SCREEN_X]: "ScreenX",
  [ScreenType.GOLD_CLASS]: "Phòng VIP",
};

/**
 * Seat Type Labels (Loại ghế)
 */
export const seatTypeLabels: Record<SeatType, string> = {
  [SeatType.NORMAL]: "Tiêu chuẩn",
  [SeatType.VIP]: "VIP",
  [SeatType.COUPLE]: "Ghế đôi",
};

/**
 * Showtime Status Labels (Trạng thái suất chiếu)
 */
export const showtimeStatusLabels: Record<ShowtimeStatus, string> = {
  [ShowtimeStatus.UPCOMING]: "Sắp chiếu",
  [ShowtimeStatus.ONGOING]: "Đang chiếu",
  [ShowtimeStatus.FINISHED]: "Đã chiếu",
  [ShowtimeStatus.CANCELLED]: "Đã hủy",
};

/**
 * Gender Labels (Giới tính)
 */
export const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: "Nam",
  [Gender.FEMALE]: "Nữ",
  [Gender.OTHER]: "Khác",
};

/**
 * Utility function to get label for any enum value
 */
export function getEnumLabel<T extends string>(
  value: T,
  mapping: Record<T, string>,
): string {
  return mapping[value] || value;
}
