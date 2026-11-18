import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import "dotenv/config";
import { Pool } from "pg";

const app: Application = express();

const port = process.env.PORT;

app.use(express.json());
// app.use(express.text())
// app.use(express.urlencoded({extended: true}))

const pool = new Pool({
    connectionString:
        "postgresql://neondb_owner:npg_g3MIkhUcRF2q@ep-dark-flower-a1t963y7.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

// console.log(pool)

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
            is_Acitve BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );`);

        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
};

initDB();

app.get("/", (req: Request, res: Response) => {
    // res.send("This is root route");

    res.status(200).json({
        success: true,
        message: "This is root route",
        authot: "Sabbir",
    });
});

app.post("/api/v1/users", async (req: Request, res: Response) => {
    // console.log(req.body)

    const { name, email, password, age } = req.body;

    const result = await pool.query(
        `
        INSERT INTO users (name, email, password, age)
        VALUES ($1, $2, $3, $4) RETURNING *
        `,
        [name, email, password, age],
    );

    // console.log(result)

    res.status(200).json({
        success: true,
        message: "User created",
        data: result.rows[0],
    });
});

app.listen(port, () => {
    console.log(`Server is running port: ${port}`);
});
