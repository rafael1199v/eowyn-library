import { NextFunction, Request, Response } from "express";
import { jwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../../domain";

export class AuthMiddlware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization) {
      return res.status(401).json({ error: "No token provided" });
    }
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Invalid token format" });
    }
    const token = authorization.replace("Bearer ", "") || "";
    try {
      const payload = await jwtAdapter.validateToken<{id: string, exp: number}>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const now = Math.floor(Date.now() / 1000);
      const isExpired = now >= payload?.exp;
      if (isExpired) return res.status(401).json({ error: "Expired token" });

      const user = await UserModel.findById(payload.id);
      if( !user ) return res.status(401).json({ error: "Invalid token - user" });
      //TODO: Validate if user is active
      req.body.user = UserEntity.fromObject(user);
      next();
    } catch (error){
      console.error("JWT validation error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}