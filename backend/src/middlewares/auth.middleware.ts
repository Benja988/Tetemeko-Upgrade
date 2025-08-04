import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserRole } from "../models/User";

interface UserPayload extends JwtPayload {
  id: string;
  role: UserRole;
}

// JWT Authentication Middleware
export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
    } else {
      res.status(403).json({ message: "Forbidden: Invalid token" });
    }
  }
};

// Role-Based Authorization Middleware
export const authorize = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: No user in request" });
      return;
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user || !allowedRoles.includes(user.role)) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};

// Super Admin Authorization Middleware
export const authorizeSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: No user in request" });
    return;
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== UserRole.ADMIN) {
      res.status(403).json({ message: "Forbidden: Only admins allowed" });
      return;
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
