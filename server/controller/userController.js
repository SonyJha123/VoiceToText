import userModel from "../model/userModel.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken';
import cloudinary from "../helpers/cloudinary.js"
import path from 'path';
import fs from 'fs';
console.log('6666666666666666666666666');


export const createUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const image = req.file ? req.file.path : null;
        if (!name || !email || !phone ||!password ) {
            return res.status(400).json({ message: 'Invalid payload' });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
          }

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
              return res.status(400).json({ message: 'Email already exist' });
          }

          let hashedPassword = await bcrypt.hash(password, 10)
        let user = await userModel.create({ name, email, phone, password:hashedPassword});
        if (image) {
            const result = await cloudinary.uploader.upload(image);
      
            user = await userModel.findByIdAndUpdate(
              user._id,
              { image,image_url: result.secure_url },
              { new: true }
            );
          }
      
      
        return res.status(201).json({ message: 'User created successfully', user });

    } catch (error) {
        console.log(error);
        
        return res.status(400).json({ message: "error"})
    }
};
console.log('7777777777777777');



export const getAllUser = async (req, res) => {
    try {
       let user = await userModel.find()
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};


export const getUserById = async (req, res) => {

    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({ message: 'User Id is required'})

        }
        let user = await userModel.findById(userId)
        return res.status(200).json({user})
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};



export const updateUser = async (req, res,) => {
    
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "user ID is required" });
        }
        

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        console.log(user,'user**');
        
        const { name } = req.body
        let newImage = user.image; 
        let imageUrl = user.image_url; 

        
        if (req.file) {
            newImage = req.file.path;

    
            const result = await cloudinary.uploader.upload(newImage);
            imageUrl = result.secure_url;

           
            if (newImage && user.image) {
                
                const oldImagePath = path.join('uploads/', '..', user.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete old image:', err);
                    }
                });
            }


        }
        const data = {
           name : name || userModel.name,
           image: newImage,
            image_url: imageUrl

        }
     
        const updatedUser = await userModel.findByIdAndUpdate(userId,data  , { new: true });

        return res.status(200).json({ message: "Updated successfully" ,updatedUser});
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({ message: "error"})
    }
};



export const deleteUser = async (req, res, ) => {
    try {
        const userId = req.params.id

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        await userModel.findByIdAndDelete(userId)
        return res.status(200).json({ message: "Deleted successfully" })
    } catch (error) {
        return res.status(400).json({ message: "error"})
    }
};


export const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log(req.body);
        

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password " });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

       
        const updateUser = await userModel.findByIdAndUpdate(user._id, { $set: { access_token: token } }, { new: true })
      

        return res.status(200).json({ message: "Login Successfully", token: token , name: user.name ,userId:user._id });
        

    } catch (error) {
     console.log(error);
     
        return res.status(400).json({ message: "error"})
    }
};
