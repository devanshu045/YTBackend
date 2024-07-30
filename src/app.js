import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: 'http://localhost:8000', // Adjust the port if your frontend runs on a different port
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Middleware to parse JSON and URL-encoded data with limits
app.use(express.json({
    limit: '16kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

// Middleware to serve static files
app.use(express.static('public'));

// Middleware to parse cookies
app.use(cookieParser());

// Import routes
import userRoute from './Routes/Userroutes.js';

// Use routes
app.use('/user', userRoute);

// Export the app
export { app };
