//Joto authentication related endpoints lekhar achey segulo ekhaney likhboo.

const express = require('express');
const User = require('../models/User');
const router = express.Router();
//express validation Use korchi bole eta niche likhechi
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');//bcrypt use korchi salt add korar jonno password aa
var jwt = require('jsonwebtoken');//jsonwebtoken use korchi user kee token generate kore deoar jonno.
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

// Route 1: Create a User using: POST "/api/auth/createuser". No login required
//Ekhaney mainly user create korchi
router.post('/createuser', [
  // name must be an name
  //name validating korar jonno eiiSyntax taa use kora hoy
  body('name', 'enter a valid name').isLength({ min: 2 }),
  // email must be an email
  //email validating korar jonno eiiSyntax taa use kora hoy
  body('email', 'enter a valid email').isEmail(),
  // password must be at least 5 chars long
  //password validating korar jonno eiiSyntax taa use kora hoy
  body('password', 'password mustbe atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  //check weater user with the same email exists
  try {
    //Ekhaney mainly find korchi jee user jee email taa put korche sei email err onno kono user achey naki amader dataBase ee..
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //Jodi upore sob thik thak thakey taholey create a new user.
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: {
        id: user.id
      }
    }


    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error: `Please enter a unique value for email`,message: err.message})})

    const authtoken = jwt.sign(data, JWT_SECRET)
    // console.log(jwtData);

    // res.json(user)
    success = true;
    res.json({success, authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error")
  }
})


// Route 2: Authenticate a User using: POST "/api/auth/logineuser". No login required.
//ekhaney mainly user ke diye login koracchi.
router.post('/login', [
  // email must be an email
  //email validating korar jonno eiiSyntax taa use kora hoy
  body('email', 'enter a valid email').isEmail(),
  body('password', 'Password cannotbe blancked').exists(),

], async (req, res) => {
  let success = false;
  //If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    //ekhaney dekhchi jee email taa agey thaka exist korche kina.. Jodi exist naa kore tahole login korte debo naa.. Arr jodi exist korey taholey if() satement aa dhukbee naa arruser login kortey parbey
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({success, error: "Please try ot login with correct credentials" });
    }
    //ekhaney password taa compare korchi.. jodi mile jayy password taholey token debo nahole if() statement err vitor dukhbey naa arr user token pabey 
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({success, error: "Please try ot login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error")
  }

})


// Route 3: Get loggedin user details of User using: POST "/api/auth/getuser". Login required
//Ekhaney mainly JWT token use korbo User kee authenticate korar jonno

//try,catch use korchi jodi kono unexpected error choley asye taholey seta key jatey handle kortey pari sei jonno.

router.post('/getuser', fetchuser , async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error")
  }
})


module.exports = router