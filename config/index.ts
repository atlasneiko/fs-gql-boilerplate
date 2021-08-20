/**
 * Config file for the application
 */

import dotenv from "dotenv";
dotenv.config();
export default {
  db: process.env.DB,
  JWT_SECRET: process.env.JWT_SECRET,
  port: process.env.PORT,
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:4020",
    "http://yourapp.com",
  ],
};
