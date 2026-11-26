import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
    //* check if the uer exist ---> ꪜDone
    const { email, password } = payload;

    const user = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email],
    );

    if (!user.rowCount) {
        console.log("From Email: ", user.rows[0]);

        throw new Error("Invalid Credentials!");
    }

    //* check if the password match ---> ꪜDone
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!matchPassword) {
        console.log("From Password: ", user.rows[0]);

        throw new Error("Invalid Password!");
    }

    //* check the user status ---> ꪜDone
    if (!user.rows[0].is_active) {
        console.log("From Active: ", user.rows[0]);

        throw new Error("Your account is not active!");
    }
    //* if pass all then grnerate jwt token ---> ꪜDone
    const jwtPayload = {
        id: user.rows[0].id,
        email: user.rows[0].email,
    };

    const accessToken = jwt.sign(jwtPayload, config.jwtSecret, {
        expiresIn: "1d",
    });

    // Strip password from the response
    delete user.rows[0].password;

    // Return the token
    return {
        accessToken,
        user: user.rows[0],
    };
};

export const authService = {
    loginUser,
};
