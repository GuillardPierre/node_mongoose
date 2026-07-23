import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongooseUniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator: function (password) {
          const passwordRegex =
            /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
          return passwordRegex.test(password);
        },
        message:
          "Password must contain at least 8 characters, 1 digit and 1 special character (!@#$%^&*)",
      },
    },
  },
  { timestamps: true },
);

userSchema.plugin(mongooseUniqueValidator, {
  message: "An account already exists with that email",
});
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password);
};

export default mongoose.model("User", userSchema);
