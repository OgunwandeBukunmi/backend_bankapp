
const mongoose = require("mongoose")

const OTPschema = new mongoose.Schema({
  ownerusername : {
    type : String,
    required : true,
  },
  OTP: { type: String, required: true },
  
}, { timestamps: true });

const OTP = mongoose.model("OTP", OTPschema);
module.exports= OTP
