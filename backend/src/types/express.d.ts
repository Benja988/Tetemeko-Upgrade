import { Request } from "express";
import { IUser } from "../models/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // or user: IUser if it's always defined
    }
  }
}



