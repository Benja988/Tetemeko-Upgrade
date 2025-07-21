// types/express/index.d.ts
/*
import { IUser } from "../../models/User";
import express from 'express'

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  } 
} */

// types/express/index.d.ts
import { UserRole } from "../../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export {};
