import { http } from "./http";
import type { Message } from "../types";

export const createMessage = async (data: Partial<Message>) => {
  return await http.post("/api/messages", data);
};
