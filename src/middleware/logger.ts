import type { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs", "logger.txt");

const logger = async (req: Request, res: Response, next: NextFunction) => {
    // console.log("URL:", req.url, "Method:", req.method, "Time:", Date.now());

    const log = `URL: ${req.originalUrl} | Method: ${req.method} | Time: ${new Date().toISOString()}`;
    // console.log(log);

    fs.appendFile(logFile, log + "\n", (err) => {
        if (err) {
            console.error("Logging failed:", err);
        }
    });
    next();
};

export default logger;
