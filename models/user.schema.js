require('dotenv').config();
const { default: mongoose, Mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { registerSchema } = require('swaggiffy');
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        minlength:6,
        maxlength:200,
    },
    email: {
        type: String,
        required: [true,'Email must not be empty!'],
        unique: [true,'Email is taken!'], // Ensures the email is unique in the collection
        lowercase: true, // Converts the email to lowercase before saving
        trim: true, // Removes leading/trailing white spaces from the email
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please enter a valid email!'] // Validates the email format
      },
      fullName:{
        type:String,
        required:[true,'Username must be provided!'],
        minlength:2,
        maxlength:30
      },
      tel:{
        type:String,
        required:[true,'Telephone number must be provided!'],
        maxlength:10,
        minlength:10
      },
      isAdmin:{
        type:Boolean,
        required:[true, "Please mention whether the user is admin"]
      },
      OTP:{
        type:String,
        minlength:32
      }
});

registerSchema('User',userSchema,{orm:'mongoose'})
function validateUser(user,type){
  const schema   = Joi.object({
      username:Joi.string().min(1).required(),
      email:Joi.string().email({tlds:{allow:false}}).required().min(5).required(),
      password:Joi.string().min(6).max(15).required()
  })
  if(type === 'login'){
      let schema = Joi.object({
          email:Joi.string().email({tlds:{allow:false}}).required().min(5).required(),
          password:Joi.string().min(6).max(15).required()
      })
      return schema.validate(user);
  }
  return schema.validate(user);
}
userSchema.methods.generateAuthToken = function(isAdmin){
let token = jwt.sign(JSON.stringify({_id:this._id,email:this.email,isAdmin:true}),process.env.JWT_PRIVATE_KEY)
return token
}
module.exports.User = new mongoose.model('User',userSchema);
module.exports.validate = validateUser;