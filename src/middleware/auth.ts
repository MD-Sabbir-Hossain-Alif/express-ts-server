import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log(
        //     `This is from protected route | Token: ${req.headers.authorization ? req.headers.authorization : "no token avalable"}`,
        // );

        console.log(roles)

        const token = req.headers.authorization;

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Unauthorized access!",
            });
            return;
        }

        try {
            const decode = jwt.verify(token, config.jwtSecret) as JwtPayload;
            const user = await pool.query(
                `
            SELECT * FROM users WHERE email=$1
            `,
                [decode.email],
            );
            // console.log(user.rows[0])

            if (!user.rowCount) {
                console.log("Loggin from user...");

                res.status(404).json({
                    success: false,
                    message: "User not valid!",
                });
                return;
            }

            if (!user.rows[0].is_active) {
                console.log("Loggin from active...");

                res.status(403).json({
                    success: false,
                    message: "Forbidden!",
                });
                return;
            }
            // console.log (req) req: {body: ""}

            req.user = decode;

            // console.log (req) req: {body: "", user: ""}
            console.log(req.user);

            next();
        } catch (error: any) {
            // console.log("Loggin from error...")
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    };
};

export default auth;
