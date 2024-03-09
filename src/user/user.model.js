import mongoose from "mongoose";
const UserSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "The firstName is required"]
    },
    lastName: {
        type: String,
        required: [true, "The lastName is required"]
    },
    userName: {
        type: String,
        required: [true, "The userName is required"]
    },
    email: {
        type: String,
        required: [true, "The email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "The password is required"]
    },
    role: {
        type: String,
        enum: ["USER_ADMIN", "USER_CLIENT"],
        default: "USER_CLIENT"
    },
    state: {
        type: Boolean,
        default: true
    }
})

export default mongoose.model('User', UserSchema);