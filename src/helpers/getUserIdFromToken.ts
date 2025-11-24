/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export const getUserIdFromToken = (req: NextRequest) => {
    try {
        const tokenValue = req.cookies.get("token")?.value || "";
        const decodedToken: any = jwt.verify(tokenValue, process.env.AUTH_SECRET as string)
        return decodedToken?.id || null
    }
    catch (error) {
        throw new Error(error instanceof Error ? error.message : "")
    }
}