
const express = require('express');
const multer = require('multer');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const path = require('path');
const cors = require('cors');
const router  = require("./router.js")
const app = express();


const allowedOrigins = [
  'https://centkey.com',
  'https://bankapp-frontend-three.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json())



app.use("/",router)

mongoose.connect(process.env.URI, {
})
.then(() => {
  console.log('MongoDB Connected!');
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
  });

})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); 
});


