export const getUserByEmailQuery = "SELECT * FROM Users WHERE email = $1"
export const registerUserQuery = "INSERT INTO Users (username, password, email, role) VALUES ($1, $2, $3, $4)";
export const loginUserQuery = "SELECT * FROM Users WHERE email = $1 AND password = $2";
