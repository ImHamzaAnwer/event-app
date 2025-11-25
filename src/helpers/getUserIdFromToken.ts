import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: string;
    email: string;
}

export const getUserIdFromToken = (req: NextRequest) => {
    try {
        const secret = process.env.AUTH_SECRET;
        if (!secret) {
            throw new Error("AUTH_SECRET is not configured");
        }
        const tokenValue = req.cookies.get("token")?.value || "";
        if (!tokenValue) {
            throw new Error("No authentication token found");
        }

        const decodedToken = jwt.verify(tokenValue, secret) as TokenPayload;
        return decodedToken?.id || null
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "")
    }
}