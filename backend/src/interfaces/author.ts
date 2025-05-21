import { Request } from "express";
import { UserRole } from "../models/User"; // adjust path if needed

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
