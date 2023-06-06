const jwt = require('jsonwebtoken');
export function authorize(req,res,next){
    try {
        const token = req.cookies.token;
        if(!token) res.status(401).send({message:"Unauthorized!"});
        const payLoad = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user = payLoad;
        next();
    } catch (error) {
        return res.status(500).send({message:'Internal Server Error',status:'failed',data:null})
    }
}