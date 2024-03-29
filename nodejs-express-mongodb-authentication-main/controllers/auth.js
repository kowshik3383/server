const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
var { expressjwt } = require("express-jwt");
const bcrypt = require("bcrypt");
const User =  require("../models/user");

exports.signup = (req, res) => {
   const errors = validationResult(req);
   const {name ,email, password} = req.body;

   if(!errors.isEmpty()){
     return res.status(422).json({
      error: errors.array()[0].msg,
     })
   }

   User.findOne({email: email}).then((user)=>{
      if(user){
        return res.status(400).json({
            error: "E-mail is already registered"
        })
      }
      const newUser = new User(req.body)
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
           if (err) throw err;
           newUser.password = hash;
           newUser.save()
           .then((user)=> res.status(200).json(user))
           .catch((error)=> res.status(400).json(error));
        });
    })
   })
   .catch((error)=>{
     return res.status(400).json({error: error});
     
   })
}


exports.signin = (req, res) => {
  const errors = validationResult(req);
  const {email, password} = req.body;
  
  if(!errors.isEmpty()){
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  User.findOne({email}).then((user)=>{

    if(!user){
      return res.status(400).json({
        error: "User not found"
      })
    }

    bcrypt.compare(password, user.password).then((isCorrect) => {
      if(isCorrect){
        const payload = {
          id: user.id,
          email: user.email, 
        }
        jwt.sign(
          payload,
          process.env.SECRET,
          { expiresIn: 3600 },
          (err, token) => {
            const {name, email, _id} = user;
            res.json({
              token: "Bearer " + token,
              name: name,
              
              email: email,
              _id: _id,
            });
            if (err) {
              res.json({
                success: false,
                error: err,
              });
            }
          }
        );
        } else {
           res.status(400).json({
             error: "Password doesn't match"
           })
        }
    }).catch((error)=>{
      res.status(500).json({
        error: error,
      })
    });
  });
}

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    status: true,
    message: "User signed-out successfully",
  });
}

exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

