import jwt from "jsonwebtoken"
const auth=async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken || req.headers?.authorization?.split(" ")[1]
        // console.log("token",token);

        if(!token){
            return res.status(401).json({
                message:"provide Token",
                error:true,
                success:false
            })
        }
        const decode = await jwt.verify(token,process.env.JWT_SECRET_TOKEN)

        // console.log(decode);
        if(!decode){
            return res.status(401).json({
                message:"unauthorized access",
                error:true,
                success:false
            })
        }
        console.log(decode);
        
        req.userId = decode._id 



        next()
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error :true,
            success :false
        })
    }
}

export default auth