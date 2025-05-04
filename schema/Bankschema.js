
const mongoose = require("mongoose")

const BankDetailsSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  country: { type: String, default: "Germany" },
  bank: { type: String, required: true },
  iban: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  ownerusername : {type:String,required:true}
}, { timestamps: true });

const Bank = mongoose.model("BankDetails", BankDetailsSchema);
module.exports= Bank
