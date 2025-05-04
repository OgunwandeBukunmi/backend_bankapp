
const mongoose = require("mongoose")

const OTPschema = new mongoose.Schema({
  OTP: { type: String, required: true },
  
}, { timestamps: true });

const OTP = mongoose.model("OTP", OTPschema);
module.exports= OTP
