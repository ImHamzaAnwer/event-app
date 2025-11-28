import User from "@/database/user.model";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: string;
    email: string;
    isAdmin: boolean;
}

const getUserIdFromToken = async () => {
    try {
        const secret = process.env.AUTH_SECRET;
        if (!secret) throw new Error("AUTH_SECRET is not configured");

        const cookieStore = await cookies();
        const tokenValue = cookieStore.get("token")?.value;

        console.log(tokenValue, "tokenValue")

        if (!tokenValue) {
            return null
        }

        const decoded = jwt.verify(tokenValue, secret) as TokenPayload;
        return decoded?.id || null;

    } catch {
        return null
    }
};

export default async function getUserDetails() {
    try {
        const userId = await getUserIdFromToken();
        if (!userId) return null;
        const user = await User.findById(userId).select("-password");
        return user || null;
    } catch (e) {
        console.error(e);
        return null;
    }
}
