// get user details using email
export const getUserByEmailQuery = "SELECT * FROM Users WHERE email = $1"

// create a new user
export const registerUserQuery = "INSERT INTO Users (username, password, email, role) VALUES ($1, $2, $3, $4)";

// log in existing user
export const loginUserQuery = "SELECT * FROM Users WHERE email = $1 AND password = $2";

// get train details using train name
export const getTrainByNameQuery = "SELECT * FROM Trains WHERE trainName = $1";

// add a new entry in trains table
export const addNewTrainQuery = "INSERT INTO Trains (trainName, source, destination, totalSeats) VALUES ($1, $2, $3, $4)";

// get seat details using trainId and seatNumber
export const getSeatDetailsQuery = "SELECT id, seatStatus FROM Seats WHERE trainId = $1 AND seatNumber = $2 FOR UPDATE";

// update seats table, set seatStatus to booked
export const bookSeatQuery = "UPDATE Seats SET seatStatus = 'booked' WHERE id = $1";

// get booking id using trainid and seatid
export const getBookingIdQuery = "SELECT id FROM Bookings WHERE userId = $1 AND trainId = $2 AND seatId = $3";

// add new entry in booking table
export const updateBookingTableQuery = "INSERT INTO Bookings (userId, trainId, seatId) VALUES ($1, $2, $3)";

// get available seats in a train using souce and destination
export const getSeatAvailabilityQuery = `SELECT t.id AS train_id,
                                                t.trainName AS train_name,
                                                (SELECT COUNT(*) FROM Seats s where s.trainId = t.id AND s.seatStatus = 'available') AS seats_available
                                        FROM Trains t
                                        WHERE t.source = $1 and t.destination = $2;
`;

// get userid, trainid, and seatid from bookings table using bookingid
export const getBookingByIdQuery = "SELECT userId, trainId, seatId FROM Bookings WHERE id = $1;"

// get userid, trainid, and seatid from bookings table using userid and tableid
export const getBookingByUserAndTrainQuery = "SELECT userId, trainId, seatId FROM Bookings WHERE userid = $1 AND trainid = $2";

// get userid and trainid from users and trains table using username and trainname
export const getUserAndTrainIdQuery = "SELECT u.id AS userId, t.id AS trainId FROM Users u, Trains t WHERE u.username = $1 AND t.trainName = $2";

// get username and trainname from users and trains table using userid and trainid
export const getUserAndTrainNameQuery = "SELECT u.username AS username, t.trainName AS trainname FROM Users u, Trains t WHERE u.id = $1 AND t.id = $2";
