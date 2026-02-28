import { z } from "zod";

export enum ScreenType {
  STANDARD = "STANDARD",
  IMAX = "IMAX",
  SCREEN_X = "SCREEN_X",
  GOLD_CLASS = "GOLD_CLASS",
}

export const screenTypeLabels: Record<ScreenType, string> = {
  [ScreenType.STANDARD]: "Tiêu chuẩn",
  [ScreenType.IMAX]: "IMAX",
  [ScreenType.SCREEN_X]: "ScreenX",
  [ScreenType.GOLD_CLASS]: "Phòng VIP",
};

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phòng phải có ít nhất 2 ký tự")
    .max(100, "Tên phòng không quá 100 ký tự"),
  screen_type: z.enum([
    ScreenType.STANDARD,
    ScreenType.IMAX,
    ScreenType.SCREEN_X,
    ScreenType.GOLD_CLASS,
  ]),
});

export const updateRoomSchema = createRoomSchema;

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
