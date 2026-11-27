import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log(
        //     `This is from protected route | Token: ${req.headers.authorization ? req.headers.authorization : "no token avalable"}`,
        // );

        console.log(roles);

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access!",
            });
        }

        try {
            const decode = jwt.verify(token, config.jwtSecret) as JwtPayload;
            const result = await pool.query(
                `
            SELECT * FROM users WHERE email=$1
            `,
                [decode.email],
            );

            const user = result.rows[0];
            // console.log(user)

            if (!result.rowCount) {
                console.log("Loggin from user...");

                return res.status(404).json({
                    success: false,
                    message: "User not valid!",
                });
            }

            if (!user.is_active) {
                console.log("Loggin from active...");

                return res.status(403).json({
                    success: false,
                    message: "Forbidden!",
                });
            }
            // TODO: check role based bussness logic
            //* roles = ["admin", "user", "moderator"]

            // user.role = "admin"
            if (roles.length && !roles.includes(user.role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized user request!",
                });
            }

            // console.log (req) req: {body: ""}
            req.user = decode;

            // console.log (req) req: {body: "", user: ""}
            // console.log(req.user);

            next();
        } catch (error: any) {
            // console.log("Loggin from error...")
            next(error)
        }
    };
};

export default auth;
