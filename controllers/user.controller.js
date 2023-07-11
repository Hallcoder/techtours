const { User, validate } = require("../models/user.schema");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { mail } = require("../utils/mail");
const { generateOTP, validateToken } = require("../utils/generateOneTimeToken");
module.exports.enroll = () => {
  return async (req, res) => {
    try {
      const { userName, fullName, email, tel, isAdmin } = req.body;
      const user = new User({
        userName,
        fullName,
        email,
        tel,
        isAdmin,
      });
      let token = generateOTP();
      user.OTP = token;
      const html = `<body>
      <h2>Reset Your Password</h2>
      <p>You can follow this link to set your password, make sure to use it before 5 min passes.</p>
      <a href="http://localhost:3000/set-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #05593c; color: #fff; text-decoration: none;">Set Password</a>
    </body>`;
      await user
        .save()
        .then(async () => {
          let emailSent = await mail(email, "Password set", html);
          if (emailSent) {
            return res.status(202).send({
              message: "User saved succesfully!",
              displayMessage: `Enrolled success!${userName} make sure to check your email to set a password before the link expires`,
              status: "Success",
              data: _.pick(user, [
                "userName",
                "fullName",
                "tel",
                "isAdmin",
                "email",
              ]),
            });
          }
        })
        .catch((err) => {
          // Check if there are validation errors
          if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            res.status(400).json({
              message: "Email already exists!",
              status: "Failed",
              displayMessage: "",
              data: null,
            });
          } else {
            // Handle other types of errors
            console.log(err);
            res.status(500).json({ error: "Failed to create a new user." });
          }
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong!",
        status: "Failed",
        displayMessage: "",
        data: null,
      });
    }
  };
};
module.exports.login = () => {
  return async (req, res) => {
    try {
      const { error } = validate(req.body, "login");
      if (error)
        return res
          .status(401)
          .json({ message: error.message, status: "failed!" });
      const user = await User.findOne({ email: req.body.email });
      console.log(user)
      if (!user)
        return res
          .status(401)
          .json({ message: "wrong email or password", status: "failed!" });
      let isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(isPasswordValid)
      if (!isPasswordValid)
        return res
          .status(401)
          .json({ message: "wrong email or password", status: "failed!" });
      const token = user.generateAuthToken(user.isAdmin);
      res.cookie("token", token, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
      });
      return res.status(202).send({
        message: "login success!",
        displayMessage: "",
        data: user,
        status: "Success",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong, Try again!",
        displayMessage: "Something went wrong, Try again!",
        data: null,
        status: "Failed!",
      });
    }
  };
};
module.exports.confirmRegistration = () => {
  return async (req, res) => {
    try {
      const isTokenValid = validateToken(req.params.token);
      if (!isTokenValid)
        return res.status(403).send({
          message: "OTP token has expired!",
          displayMessage: "Try request for resending the link",
          status: "Failed",
          data: null,
        });
      const { password } = req.body;
      const salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
      const user = await User.findOneAndUpdate(
        { OTP },
        {
          password: hashed,
        }
      );
      // if (user.email) return res.status(403).send({ message: "User is " });
      await user
        .save()
        .then(async (_) => {
          user.OTP = "";
          await user.save();
          return res.status(202).send({
            message: "Password created successfully",
            status: "Success",
            displayMessage: "Redirecting to login...",
            data: _.pick(user, ["userName", "fullName", "email"]),
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({
            message: "Something went wrong!",
            status: "Success",
            displayMessage: "Try again!",
            data: null,
          });
        });
    } catch (error) {
      console.log(err);
      return res.status(500).send({
        message: "Something went wrong!",
        status: "Success",
        displayMessage: "Try again!",
        data: null,
      });
    }
  };
};

module.exports.createAdmin = () => {
  return async (req, res) => {
    try {
      const { userName, fullName, email,password,code, tel, isAdmin } = req.body;
      if(code != 'techtours19'){
        return res.status(401).send({
          message:'Unauthorized',
          displayMessage:"Unauthorized",
          data:null,
          status:"Failed"
        })
      }
      const user = new User({
        userName,
        fullName,
        email,
        password,
        tel,
        isAdmin,
      });
      const salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
      user.password = hashed;
      await user.save().then(_=>{
        return res.status(202).send({
          message:'Admin created',
          displayMessage:"",
          data:_.pick("userName","email","tel",user),
          status:"Failed"
        })
      })
    } catch (err) {
      console.log(err)
      if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
        res.status(400).json({
          message: "Email is taken!",
          status: "Failed",
          displayMessage: "",
          data: null,
        });
      } else {
        // Handle other types of errors
        console.log(err);
        res.status(500).json({ error: "Failed to create admin." });
      }
    }
  };
};

module.exports.getUserById = () => {
  return async(req,res) => {
    try {
      const user = await User.findById(req.params.id);
      if(!user) return res.status(404).send({
        message:'User does not exist',
        displayMessage:"",
        data:null,
        status:"Failed"
      })
      return res.status(202).send({
        message:'User returned',
        displayMessage:"",
        data:_.pick("userName","email","tel",user),
        status:"Success"
      })
    } catch (error) {
      res.status(500).json({ error: "Something went wrong!" , message:error.message});
    }
  }
}
