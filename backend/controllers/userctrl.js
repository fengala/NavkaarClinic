import bcrypt from 'bcrypt';
import PatientModel from '../models/patientModel.js';
import {JWT_SECRET} from '../config.js'
import jwt from 'jsonwebtoken';


export const registerController = async (req, res) => {
    try {
        const existingUser = await PatientModel.findOne({email: req.body.email});
        if (existingUser) {
            return res.status(200).send({success: false, message: 'User email already exists!'});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password with a salt round of 10
        const newUser = new PatientModel({
            ...req.body,
            password: hashedPassword // Use the hashed password
        });
        await newUser.save();

        const token = jwt.sign({id:newUser._id}, JWT_SECRET, {expiresIn: '1d'})

        return res.status(200).send({success: true, message: 'Register Successful!', token});
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send({success: false, message: `Error during registration: ${error.message}`});
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await PatientModel.findOne({ email });
        if (!user) {
            return res.status(200).send({ success: false, message: 'User not found!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(200).send({ success: false, message: 'Invalid credentials' });
        }
        // Implement JWT token generation or session creation here for authentication
        const token = jwt.sign({id:user._id}, JWT_SECRET, {expiresIn: '1d'})

        return res.status(200).send({ success: true, message: 'Login successful', token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send({ success: false, message: `Error during login: ${error.message}` });
    }
};


export const authController = async (req, res) => {
    try {
        const user = await userModel.findOne({_id: req.userId}); // use req.userId
        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found!' });
        } else {
            console.log(user.firstname, user.email);
            return res.status(200).send({ success: true, 
                data: {firstname: user.firstname, email: user.email}}); // Set success to true
        }
    } catch (error) {
        console.error("Auth error:", error);
        res.status(500).send({ success: false, message:'Auth error!'});
    }
};