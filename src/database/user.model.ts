import { Schema, model, models } from 'mongoose';

interface IUser {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAdmin: boolean;
    forgotPasswordToken: string,
    forgotPasswordTokenExpiry: Date,
    verifyToken: string,
    verifyTokenExpiry: Date
}

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "please provide username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "please provide email address"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please provide password"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

const User = models.User || model<IUser>('User', userSchema);

export default User;