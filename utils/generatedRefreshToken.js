
import jwt  from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

const generatedRefreshToken = async(userId)=>{
    const token = await jwt.sign({_id:userId},process.env.JWT_SECRET_TOKEN,{expiresIn:"7d"})

    const updateRefreshTokenUser = await UserModel.updateOne({_id:userId},{
        refresh_token:token
    })

    return token
}

export default generatedRefreshToken