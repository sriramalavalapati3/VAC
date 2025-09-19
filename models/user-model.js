const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  password: { type: String, required: true }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
