import User from "@/database/user.model";
import { getUserIdFromToken } from "./getUserIdFromToken";

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
