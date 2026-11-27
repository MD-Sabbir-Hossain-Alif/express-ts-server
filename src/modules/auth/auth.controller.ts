import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);

        const { refreshToken } = result;

        res.cookie("refreshToken", refreshToken, {
            secure: false, // http or local -> false, https / in production -> true
            httpOnly: true, // prevent XSS attack
            sameSite: "lax", // "none", "strict" , "lax"  -> prevent CSRF attack
            path: "/",
            // maxAge -> how long it save in cookies
            domain: "localhost", // .example.com
        });

        res.status(200).json({
            success: true,
            message: "Login successfull",
            data: result,
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error?.message || "Login failed",
        });
    }
};

const generateToken = async (req: Request, res: Response) => {
    try {
        console.log(req.cookies.refreshToken);

        const result = await authService.generateAccessToken(
            req.cookies.refreshToken,
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Access token generated successfull",
            data: result,
        });
    } catch (err: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: err?.message || "Token generation Failed",
        });
    }
};

export const authController = {
    loginUser,
    generateToken,
};
