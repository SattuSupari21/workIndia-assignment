# WorkIndia Assignment
## Features

- User Login and Registration
- User Authentication using JWT
- Add new Trains (ADMIN ONLY)
- Get Trains based on source and destination
- Check seat availability
- Book a seat
- View booking details


## Installation

Clone the repository:

```bash
git clone https://github.com/SattuSupari21/workIndia-assignment.git
cd workIndia-assignment

```

Install dependencies:
```bash
npm Install
```

Set up the environment variables:
- Create a .env file in the root directory.
- Add the following variables and replace values as needed:
```bash
PORT=3000
USERNAME="postgres"
HOST="localhost"
DATABASE="workIndia"
PASSWORD="password"
ADMIN_API_KEY="admin-key"
JWT_SECRET=your_jwt_secret

```
Initialize the PostgreSQL database:
- Run the following commands to create the necessary tables:
```sql
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) NOT NULL
);

CREATE TABLE Trains (
    id SERIAL PRIMARY KEY,
    trainName VARCHAR(100) UNIQUE NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    totalSeats INT NOT NULL
);

CREATE TABLE Seats (
    id SERIAL PRIMARY KEY,
    trainId INT NOT NULL,
    seatNumber VARCHAR(10) UNIQUE NOT NULL,
    seatStatus VARCHAR(20) NOT NULL,
    FOREIGN KEY (trainId) REFERENCES Trains(id) ON DELETE CASCADE
);

CREATE TABLE Bookings (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    trainId INT NOT NULL,
    seatId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (trainId) REFERENCES Trains(id) ON DELETE CASCADE,
    FOREIGN KEY (seatId) REFERENCES Seats(id) ON DELETE CASCADE
);
```

Start the server:
```bash
npm run dev
```

Test the API:
- Use Postman or any REST API client to test the endpoints.
## API Reference

#### Register a User

```http
  POST /api/v1/registerUser
```

| Parameter | Type     |
| :-------- | :------- |
| `email` | `string` |
| `password` | `string` |
| `name` | `string` |

#### Log in a User

```http
  POST /api/v1/loginUser
```

| Parameter | Type     |
| :-------- | :------- |
| `email` | `string` |
| `password` | `string` |

#### Add new Train (ADMIN ONLY)

```http
  POST /api/v1/addNewTrain
```

| Parameter | Type     |
| :-------- | :------- |
| `adminAPIKey` | `string` |
| `trainName` | `string` |
| `source` | `string` |
| `destination` | `string` |
| `totalSeats` | `number` |

#### Book a Seat

```http
  POST /api/v1/bookSeat
```

| Parameter | Type     |
| :-------- | :------- |
| `trainId` | `string` |
| `seatNumber` | `string` |

#### Get List of Trains from source to destination

```http
  POST /api/v1/getTrainsFromSourceToDest
```

| Parameter | Type     |
| :-------- | :------- |
| `source` | `string` |
| `destination` | `string` |

#### Get Booking Details
- User can get train details using a Booking ID or Username and Train name.

```http
  POST /api/v1/getBookingDetails
```

| Parameter | Type     |
| :-------- | :------- |
| `bookingId` | `number` |

OR

| Parameter | Type     |
| :-------- | :------- |
| `username` | `string` |
| `trainName` | `string` |
