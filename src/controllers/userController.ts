import { Request, RequestHandler, Response } from "express";
import pool from "../config/database";
import jwt from "jsonwebtoken";
import { addNewTrainQuery, getTrainByName, getUserByEmailQuery, loginUserQuery, registerUserQuery } from "../constants/queries";

export const registerUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // check if the user already exists
    const userExists = await pool.query(getUserByEmailQuery, [email]);

    if (userExists.rows.length) {
      res.status(409).json({ status: "error", msg: "User already exists!" });
      return;
    }

    // create new user
    const userRole = role ? role : "user";
    await pool.query(registerUserQuery, [name, password, email, userRole]);

    const newUser = await pool.query(getUserByEmailQuery, [email]);
    const { username, id } = newUser.rows[0];
    const token = jwt.sign(
      { userId: id },
      process.env.JWT_SECRET || "huehuehue",
      {
        expiresIn: "1h",
      },
    );

    res.status(201).json({
      username,
      token,
    });
  } catch (e) {
    const error = (e as Error).message;
    res.status(500).json({ status: "error", error });
  }
}

export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await pool.query(loginUserQuery, [email, password]);
    if (!user.rows.length) {
      res.status(401).json({ status: "error", msg: "Invalid email or password!" });
      return;
    }

    const { id, username } = user.rows[0];
    const token = jwt.sign(
      { userId: id },
      process.env.JWT_SECRET || "87c155f1c28123b638cecddc3d40a62ef7dd2c0d8e13cb3e734231f741c55820",
      {
        expiresIn: "1h",
      },
    );

    res.status(200).json({ username, token });
  } catch (e) {
    const error = (e as Error).message;
    res.status(500).json({ status: "error", error });
  }
};

export const addNewTrain: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body.adminAPIKey) {
      res.status(403).json({ status: "error", msg: "Admin API key is required!" });
      return;
    }

    const { adminAPIKey }: { adminAPIKey: string } = req.body;
    if (adminAPIKey.localeCompare(process.env.ADMIN_API_KEY || "admin-key") != 0) {
      res.status(403).json({ status: "error", msg: "403 Forbidden (Invalid API key)" });
      return;
    }

    const { trainName, source, destination, totalSeats } = req.body;

    const trainExists = await pool.query(getTrainByName, [trainName]);
    if (trainExists.rows.length) {
      res.status(409).json({ status: "error", msg: "Train already exists!" });
      return;
    }

    await pool.query(addNewTrainQuery, [trainName, source, destination, totalSeats]);

    res.status(201).json({ status: "success", msg: "New Train added successfully!" })
  } catch (e) {
    const error = (e as Error).message;
    res.status(500).json({ status: "error", error });
  }
}
