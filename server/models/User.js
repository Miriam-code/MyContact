import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
     phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => v.length >= 10 && v.length <= 12,
        message: (props) =>
          `${props.value} n'est pas un numéro de téléphone valide`,
      },
      unique: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
