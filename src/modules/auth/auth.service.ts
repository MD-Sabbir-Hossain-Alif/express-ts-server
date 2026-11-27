import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
    //* check if the uer exist ---> ꪜDone
    const { email, password } = payload;

    const result = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email],
    );

    const user = result.rows[0];

    if (!result.rowCount) {
        console.log("From Email: ", user);

        throw new Error("Invalid Credentials!");
    }

    //* check if the password match ---> ꪜDone
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        console.log("From Password: ", user);

        throw new Error("Invalid Password!");
    }

    //* check the user status ---> ꪜDone
    if (!user.is_active) {
        console.log("From Active: ", user);

        throw new Error("Your account is not active!");
    }
    //* if pass all then grnerate jwt token ---> ꪜDone
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, config.access_Secret, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(jwtPayload, config.refresh_Secret, {
        expiresIn: "7d",
    });

    // Strip password from the response
    delete user.password;

    // Return the token
    return {
        accessToken,
        refreshToken,
        user: user,
    };
};

const generateAccessToken = async (token: string) => {
    if (!token) {
        throw new Error("Access Token Error");
    }

    const decode = jwt.verify(token, config.refresh_Secret) as JwtPayload;
    const result = await pool.query(
        `
            SELECT * FROM users WHERE email=$1
            `,
        [decode.email],
    );

    const user = result.rows[0];
    console.log(user);

    if (!result.rowCount) {
        // console.log("Loggin from user...");
        throw new Error("User not valid!");
    }

    if (!user.is_active) {
        // console.log("Loggin from active...");
        throw new Error("Forbidden!");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(jwtPayload, config.access_Secret, {
        expiresIn: "15m",
    });

    return {accessToken}
};;

export const authService = {
    loginUser,
    generateAccessToken,
};
