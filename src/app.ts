import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();

app.use(express.json());
// app.use(express.text())
// app.use(express.urlencoded({extended: true}))

//? Users route
app.use("/api/v1/users", userRoute);


//? Root route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "This is root route",
        authot: "Sabbir",
    });
});

export default app;
