import jwt from "jsonwebtoken"

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token) {
        return res.status(401).json({error : "Unauthorized"});
    }
    jwt.verify(token, process.env.JWT_SECRET,(err,user) => {
        if(err) {
            res.status(401).json({error : "Unauthorized"})
        }
        console.log(user);
        req.user = user;
        next();
    })
}