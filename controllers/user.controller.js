const { User } = require("../models/user.schema");
const bcrypt = require("bcrypt");
const _ = require("lodash");
module.exports.enroll = (req, res) => {
  return async (req, res) => {
    try {
      const { userName, fullName, email, password, tel, role } = req.body;
      const user = new User({
        userName,
        fullName,
        email,
        tel,
        role,
      });

      await user
        .save()
        .then(() => {
          return res.status(202).send({
            message: "User saved succesfully!",
            status: "Success",
            data: _.pick(user, [
              "userName",
              "fullName",
              "tel",
              "role",
              "email",
            ]),
          });
        })
        .catch((err) => {
          // Check if there are validation errors
          if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            res.status(400).json({
              message: "Email already exists!",
              status: "Failed",
              data: null,
            });
          } else {
            // Handle other types of errors
            res.status(500).json({ error: "Failed to create a new user." });
          }
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Something went wrong!",
        status: "Failed",
        data: null,
      });
    }
  };
};

module.exports.confirmRegistration = () => {
  return async (req, res) => {
    try {
      const { password, email } = req.body;
      const salt = await bcrypt.genSalt(10);
      let hashed = await bcrypt.hash(password, salt);
      const user = await User.findOneAndUpdate(
        { email },
        {
          password: hashed,
        }
      );
      if(user.email) return res.status(403).send({message:'User is '})
      await user.save().then(_=>{
        return res.status(202).send({message:'Password created successfully',status:'Success',data:_.pick(user,['userName','fullName','email'])})
      }).catch(err =>{
        return res.status()
      })
    } catch (error) {}
  };
};
