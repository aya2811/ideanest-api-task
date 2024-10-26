const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken"); 
const User = require("../models/user");

exports.signUp = async(req,res)=>{
    try{
        // Check If The Input Fields are Valid
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res
              .status(400)
              .json({ message: "Please Input Name, Email and Password" });
          }

        // Check If User Exists In The Database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User Already Exists" });
        }

        // Hash The User's Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save The User To The Database
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res
            .status(201)
            .json({ message: "User Created Successfully" });
    }   
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error creating user" });
    }
    
}

exports.signIn = async(req,res)=>{
    try {
        const { email, password } = req.body;
    
        // Check If The Input Fields are Valid
        if (!email || !password) {
          return res
            .status(400)
            .json({ message: "Please Input Email and Password" });
        }
    
        // Check If User Exists In The Database
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: "Invalid Email or password" });
        }
    
        // Compare Passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ message: "Invalid Email or password" });
        }
    
        // Generate JWT Token
        const accessToken = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.ACCESS_TOKEN_SECRET || "1234!@#%<{*&)",
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign({
            email: user.email,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // Assigning refresh token in http-only cookie 
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
    
        return res
          .status(200)
          .json({ message: "Login Successful", 
                access_token: accessToken , 
                refresh_token: refreshToken });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Error during login" });
      }
}

exports.refreshToken = async(req,res) => {
    if (req.body.refresh_token) {

        // Destructuring refreshToken from cookie
        const refreshToken = req.body.refresh_token;


        // Verifying refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {

                    // Wrong Refesh Token
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                else {
                    // Correct token we send a new access token
                    const accessToken = jwt.sign(
                    {user: decoded.user},
                    process.env.ACCESS_TOKEN_SECRET || "1234!@#%<{*&)",
                    { expiresIn: "1h" }
                    );
                    
                    return res.json({ message: "Access Token Changed Successfully", 
                                    access_token: accessToken , 
                                    refresh_token: refreshToken  });
                }
            })
    } else {
        return res.status(406).json({ message: 'Unauthorized' });
    }
}