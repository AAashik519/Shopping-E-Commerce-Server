import jwt from "jsonwebtoken"

const generatedAccessToken =async(userId)=>{
    const token = await jwt.sign({_id:userId},process.env.JWT_SECRET_TOKEN,{expiresIn:'24h'})

    return token
}

export default generatedAccessToken