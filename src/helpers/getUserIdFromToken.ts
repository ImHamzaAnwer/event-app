import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface TokenPayload {
    id: string;
    email: string;
}

export const getUserIdFromToken = async () => {
    try {
        const secret = process.env.AUTH_SECRET;
        if (!secret) throw new Error("AUTH_SECRET is not configured");

        const cookieStore = await cookies();
        const tokenValue = cookieStore.get("token")?.value;

        if (!tokenValue) {
            throw new Error("No authentication token found");
        }

        const decoded = jwt.verify(tokenValue, secret) as TokenPayload;
        return decoded?.id || null;

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "");
    }
};
