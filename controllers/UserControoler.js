import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"
import validator from "validator"

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const createAdminToken = (email) => {
    return jwt.sign({ role: "admin", email }, process.env.JWT_SECRET)
}

// login user


const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    try {
        if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
            const token = createAdminToken(email)
            return res.json({success:true,token,isAdmin:true});
        }

        const user  = await userModel.findOne({email})
        if(!user){
             return res.json({success:false,massage:"User Doesn't exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.json({success:false,massage:"Invalid credentials"});
        }
        const token = createToken(user._id)
         return res.json({success:true,token});
    } catch (error) {
        console.log(error)
        res.json({success:false,massage:"Error"});
    }
}





// register user
const registerUser = async (req,res)=>{
    const {name,password,email} = req.body;
    try {
        // checking is user already exists?
        const exist  = await userModel.findOne({email});
        if (exist) {
            return res.json({success:false,massage:"User already exists"});
        }

        // validator email formate and strong password

        if (!validator.isEmail(email)) {
            return res.json({success:false,massage:"Please enter a valid email"});

        }

        if (password.length<8) {
             return res.json({success:false,massage:"Please enter a strong password"});
        }

        // hasing user password

        const salt = await bcrypt.genSalt(10)
        const hashedPassword  = await bcrypt.hash(password,salt)
        const newUser  = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save();
        const token  = createToken(user._id)
        res.json({success:true,token})
    } catch (error) {
        console.log(error)
        res.json({success:false,massage:"Error"});
    }
}



export {loginUser,registerUser}
