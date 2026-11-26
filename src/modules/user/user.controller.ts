import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserIntoDB(req.body);
        // console.log(result);

        res.status(201).json({
            success: true,
            message: "User created",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const getAllUser = async (req: Request, res: Response) => {
    // TODO: checking user in req, console.log("From contorler:", req.user) 
    
    try {
        const result = await userService.getAllUsersFromDB();

        delete result.rows[0].password

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // console.log(id);
        const result = await userService.getUserFromDB(id as string);

        // console.log(result.rows);

        if (!result.rowCount) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

const updateUser = (async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await userService.updateUserIntoDB(req.body, id as string)
        // console.log(result.rows);

        if (!result.rowCount) {
            res.status(404).json({
                success: false,
                message: "User not found!",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
})

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await userService.deleteUserFromDB(id as string)

        // console.log(result)

        if (!result.rowCount) {
            res.status(404).json({
                success: false,
                message: "User not found!",
                // data: result,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            // data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser
};
