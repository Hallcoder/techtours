const { default: mongoose, Mongoose } = require("mongoose");

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
      role:{
        type:String,
        required:[true, "Please assign a role to the user!"]
      }
})

module.exports.User = new mongoose.model('User',userSchema);