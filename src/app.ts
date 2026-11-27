import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import globalErrorHandler from "./middleware/globalErrorHandler";
import cors from "cors"

const app: Application = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    }),
);

app.use(express.json());
// app.use(express.text())
// app.use(express.urlencoded({extended: true}))

// TODO: logger meddleware ---> ꪜDone
app.use(logger);

//? Users route
app.use("/api/v1/users", userRoute);

//? Users profile route
app.use("/api/v1/profile", profileRoute);

//? auth
app.use("/api/v1/auth", authRoute);

//? Root route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "This is root route",
        authot: "Sabbir",
    });
});

// TODO: Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
