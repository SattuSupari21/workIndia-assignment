import { Request, RequestHandler, Response } from "express";
import pool from "../config/database";
import jwt from "jsonwebtoken";
import {
  addNewTrainQuery,
  bookSeatQuery,
  getSeatAvailabilityQuery,
  getSeatDetailsQuery,
  getTrainByName,
  getUserByEmailQuery,
  loginUserQuery,
  registerUserQuery,
  updateBookingTableQuery
} from "../constants/queries";

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
      process.env.JWT_SECRET || "random-secret",
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

type AvailableTrainType = {
  train_name: string,
  seats_available: number
};

export const getTrainsFromSourceToDest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { source, destination } = req.body;
  try {
    const availableSeats = await pool.query(getSeatAvailabilityQuery, [source, destination]);

    if (!availableSeats.rows.length) {
      res.status(200).json({ status: "error", msg: `No Seats available from ${source} to ${destination}` });
      return;
    }

    let trainsAvailable: AvailableTrainType[] = [];
    availableSeats.rows.map((seat) => {
      const { train_name, seats_available } = seat;
      trainsAvailable.push({ train_name, seats_available });
    })

    res.status(200).json({ trainsAvailable });

  } catch (e) {
    const error = (e as Error).message;
    res.status(500).json({ status: "error", error });
  }
}

export const bookSeat: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { seatNumber, trainId } = req.body;
  const client = await pool.connect();
  try {
    // transaction start
    await client.query("BEGIN");
    await client.query("SET TRANSACTION ISOLATION LEVEL SERIALIZABLE");

    // checking seat availability
    const seatAvailable = await client.query(getSeatDetailsQuery, [trainId, seatNumber]);

    if (!seatAvailable.rows.length) {
      res.status(404).json({ status: "error", msg: "Seat not found!" });
      return;
    }

    if (seatAvailable.rows[0].seatstatus === "booked") {
      res.status(403).json({ status: "error", msg: "Seat unavailable" });
      return;
    }

    const userId = req.userId;
    const seatId = seatAvailable.rows[0].id;

    await client.query(bookSeatQuery, [seatId]);
    await client.query(updateBookingTableQuery, [userId, trainId, seatId]);

    // transaction finished
    await client.query("COMMIT");

    res.json({ status: "success", message: "Seat booked successfully!" });
  } catch (e) {
    // transaction roll back
    await client.query("ROLLBACK");
    const error = (e as Error).message;
    res.status(500).json({ status: "error", error });
  } finally {
    client.release();
  }
};
