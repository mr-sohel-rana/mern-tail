const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    otp: { type: Number, default: 0 },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to avoid overwriting it
const userModel = mongoose.models.user || mongoose.model("user", UserSchema);

module.exports = userModel;
