export const getUserByEmailQuery = "SELECT * FROM Users WHERE email = $1"
export const registerUserQuery = "INSERT INTO Users (username, password, email, role) VALUES ($1, $2, $3, $4)";
export const loginUserQuery = "SELECT * FROM Users WHERE email = $1 AND password = $2";
export const getTrainByName = "SELECT * FROM Trains WHERE trainName = $1";
export const addNewTrainQuery = "INSERT INTO Trains (trainName, source, destination, totalSeats) VALUES ($1, $2, $3, $4)";
export const getSeatDetailsQuery = "SELECT id, seatStatus FROM Seats WHERE trainId = $1 AND seatNumber = $2 FOR UPDATE";
export const bookSeatQuery = "UPDATE Seats SET seatStatus = 'booked' WHERE id = $1";
export const updateBookingTableQuery = "INSERT INTO Bookings (userId, trainId, seatId) VALUES ($1, $2, $3)";
