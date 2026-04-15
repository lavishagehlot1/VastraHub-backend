import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required:true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      }, //only required for local user
      minLength: 6,
      default: null,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String, //store goggle or facebook id
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
     refreshToken: {
        type: String,
        default: null
    }, //user can have only one refresh token at a time, if user login from another device then previous refresh token will be invalidated

    //refreshTokens: [String]--> for multiple refresh tokens if user login from multiple devices

    paswordResetToken:{
        type:String,
    },
    
    passwordResetTokenExpiry:{
        type:Date,
    }
  },
  { timestamps: true }
);

//Hashed password

authSchema.pre("save", async function () {
  if (this.provider !== "local") return;
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

//compare password
authSchema.methods.comparePassword = async function (userPassword) {
  if (this.provider !== "local") return false;
  return await bcrypt.compare(userPassword, this.password);
};

//otp methods
// authSchema.methods.sendOtp=async function (otp){

//     this.otp=await bcrypt.hash(otp,10);
//     this.otpExpiry=Date.now()+10*60*1000;

// };

// authSchema.methods.verifyOtp=async function(enteredOtp){
//     if(!this.otp|| thhis.otpExpiry<Date.now()) return false; //date.now cuurent date or tym ko btata hai 
//     return await bcrypt.compare(enteredOtp,this.otp)
// }

export const User = mongoose.model("User", authSchema);

/**
 * this in Mongoose Schema Methods.
 * this refers to the document instance.
That means the specific user object you are working with.

authSchema.methods
methods is a special Mongoose object where you define instance methods.
Instance methods are functions available on each document.
 */