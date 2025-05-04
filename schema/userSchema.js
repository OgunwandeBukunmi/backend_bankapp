const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    SecondName: {
      type: String,
      required: true,
    },
    OtherName: {
      type: String,
      required: true,
    },
    UserName: {
      type: String,
      required: true,
    },
    Email:{
      type : String,
      required : true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateofBirth: {
      type: Date,
      required: true,
    },
    verification : {
      type : Boolean,
      default : false
    },
    files: [
      {
        data: Buffer, 
        contentType: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;