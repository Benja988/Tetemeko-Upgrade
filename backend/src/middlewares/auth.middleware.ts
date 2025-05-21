import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser, UserRole } from "../models/User";


export interface UserPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}

// ✅ JWT Authentication Middleware
export const authenticateJWT = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; // ✅ Explicit return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      role: decoded.role as UserRole, // ✅ Ensure role is cast correctly
    };

    return next(); // ✅ Always call next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
    } else {
      res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    return; // ✅ Explicit return
  }
};

// ✅ Role-Based Authorization Middleware
export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized: No user found in request" });
      return; // ✅ Explicit return
    }

    try {
      const user = await User.findById(authReq.user.id);
      if (!user || !allowedRoles.includes(user.role as UserRole)) {
        res.status(403).json({ message: "Access denied" });
        return; // ✅ Explicit return
      }

      return next(); // ✅ Always call next()
    } catch (err) {
      return next(err);
    }
  };
};

// ✅ Super Admin Authorization Middleware
export const authorizeSuperAdmin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {  
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ message: "Unauthorized: No user found in request" });
    return;
  }

  try {
    const user = await User.findById(authReq.user.id);
    if (!user || user.role !== UserRole.ADMIN) {
      res.status(403).json({ message: "Forbidden: Only admins can perform this action" });
      return;
    }

    return next(); // ✅ Always call next()
  } catch (error) {
    return next(error);
  }
};
