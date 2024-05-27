import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false // ทำให้ไม่จำเป็นต้องมี email
        },
        password: {
            type: String,
            required: false // ทำให้ไม่จำเป็นต้องมี password
        },
        role: {
            type: String,
            default: "user"
        },
        picture: String,
        displayName: String,
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
