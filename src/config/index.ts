import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

const config = {
    port: process.env.PORT,
    connectionString: process.env.DATABASE_URI,
    access_Secret: process.env.ACCESS_SECRET as string,
    refresh_Secret: process.env.REFRESH_SECRET as string,
};

export default config;
