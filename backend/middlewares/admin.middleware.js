import { User } from "../models/user.model.js"

export const isAdmin = async(req,next) => {
    const user = await User.findById(req.user._id);
    if(user.role === "admin") next();
}