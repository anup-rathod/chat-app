 import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            return res.status(401).json({ error: "Unauthorized - No Token provided" })
        }
        //to verify the token 
        const decode = jwt.verify( token , process.env.JWT_SECRET);

        if(!decode){
            return res.status(401).json({ error: "Unauthorized - Invalid Token" })
        }

        const user = await User.findById(decode.userId).select("-password");

        if(!user){
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in Protect Route Middleware", error.message)
        res.status(500).json({ error: "Interal Server Error "});
    }
}

export default protectRoute;