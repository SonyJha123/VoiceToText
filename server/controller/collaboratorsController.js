import collaboratorsModel from "../model/collaboratorsModel.js";
import fs from "fs";
import cloudinary from "../helpers/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  extractKeywords from "../helpers/keywordExtractor.js"

import path from "path";
export const creatCollaborator = async (req, res) => {
  try {
    console.log("inside createCollab");

    const {
      name,
      email,
      phone,
      gender,
      profession,
      date_of_birth,
      bio,
      password,
      verified,
      about
    } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !email || !phone || !gender || !password||!about ){
      return res.status(400).json({ message: "invalid payload" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);

    let collaborator = await collaboratorsModel.create({
      name,
      email,
      phone,
      gender,
      profession,
      date_of_birth,
      bio,
      password: hashedPassword,
      verified,
      about
    });
    if (image) {
      const result = await cloudinary.uploader.upload(image);

      collaborator = await collaboratorsModel.findByIdAndUpdate(
        collaborator._id,
        {image, image_url: result.secure_url },
        
        { new: true }
      );
    }

    return res
      .status(201)
      .json({ message: "collaborater creates sucessfully", collaborator });
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: err.message });
  }
};

export const deleteCollaborator = async (req, res, next) => {
  try {
    const CollaboratorId = req.params.id;
    if (!CollaboratorId) {
      return res.status(400).json({ message: "collaborator id is required" });
    }

    const collaborator = await collaboratorsModel.findByIdAndDelete(
      CollaboratorId
    );
    if (!collaborator) {
      return res.status(404).json({ message: "collaborator not found" });
    }

    return res
      .status(200)
      .json({ message: "collaborator deleted sucessfully", collaborator });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateCollaborator = async (req, res, next) => {
  try {
    const CollaboratorId = req.params.id;
    if (!CollaboratorId) {
      return res.status(400).json({ message: "collaborator id is required" });
    }

    const collaborator = await collaboratorsModel.findByIdAndUpdate(
      CollaboratorId
    );

    if (!collaborator) {
      return res.status(404).json({ message: "collaborator not found" });
    }
    const { name, profession, bio, verified,about } = req.body;

    let newImage = collaborator.image;
    let imageUrl = collaborator.image_url;

    if (req.file) {
      newImage = req.file.path;

      const result = await cloudinary.uploader.upload(newImage);
      imageUrl = result.secure_url;

      if (newImage && collaborator.image) {
        const oldImagePath = path.join("uploads/", "..", collaborator.image);
        fs.unlink(oldImagePath, (err) => {
          console.log("image unlinked sucessfully");

          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });
      }
    }
    const data = {
      name: name || collaborator.name,
      profession: profession || collaborator.profession,
      bio: bio || collaborator.bio,
      verified: verified || collaborator.verified,
      about:about||collaborator.about,
      image: newImage,
      image_url: imageUrl,
    };

    const updatedcollaborator = await collaboratorsModel.findByIdAndUpdate(
      CollaboratorId,
      data,
      { new: true }
    );
    return res
      .status(200)
      .json({
        message: "collaborator uppdated sucessfully",
        updatedcollaborator,
      });
  } catch (err) {
    console.log(err);

    return res.status(400).json({ message: err.message });
  }
};

export const getCollaboratorbyId = async (req, res) => {
  try {
    const CollaboratorId = req.params.id;
    if (!CollaboratorId) {
      return res.status(400).json({ message: "collaborator id is required" });
    }

    const collaborator = await collaboratorsModel.findById(CollaboratorId);

    if (!collaborator) {
      return res.status(404).json({ message: "collaborator not found" });
    }
    return res
      .status(200)
      .json({ message: "sucessfully get collaborator", collaborator });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const Collaborator_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const collaborator = await collaboratorsModel.findOne({ email: email });

    if (!collaborator) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, collaborator.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password " });
    }

    const token = jwt.sign(
      { collaboratorId: collaborator._id, email: collaborator.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const updateUser = await collaboratorsModel.findByIdAndUpdate(
      collaborator._id,
      { $set: { token: token } },
      { new: true }
    );

    return res
      .status(200)
      .json({
        message: "Login Successfully",
        token: token,
        name: collaborator.name,
        collaboratorId: collaborator._id,
      });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ message: "error" });
  }
};



export const getkeywordsbytext=async(req,res)=>{

  try{

    const {speechText}=req.query;
    if (!speechText || typeof speechText !== "string") {
      return res.status(400).json({ message: "Invalid speech text provided" });
  }
  

    const keywords = extractKeywords(speechText);
    if (!keywords || keywords.length === 0) {
        return res.status(400).json({ message: 'No keywords extracted from speech' });
    }
     const finalkeywords=keywords.reverse()
    
       return res.status(200).json({message:"here is your keywords",finalkeywords})
    

    


  }
  catch(err){
    console.log(err)
    return res.status(400).json({message:err.message})
  }

}




export const getcollaboratorsbyKeywords=async(req,res)=>{

  try{

  //   const {speechText}=req.body;
  //   if (!speechText || typeof speechText !== "string") {
  //     return res.status(400).json({ message: "Invalid speech text provided" });
  // }
  

    // const keywords = extractKeywords(speechText);
    // if (!keywords || keywords.length === 0) {
    //     return res.status(400).json({ message: 'No keywords extracted from speech' });
    // }
    // if(keywords){
    //   res.status(200).json({message:"here is your keywords",keywords})
    // }

    let {keywords}=req.query
    if (!keywords) 
      
      
      
      {
      return res.status(400).json({ message: "Invalid or missing keywords" });
    }
    if (typeof keywords === 'string') {
      keywords = [keywords];
    }


    const query = {
      $or: [
          { name: { $regex: keywords.join('|'), $options: 'i' } },
          { profession: { $regex: keywords.join('|'), $options: 'i' } },
          { bio: { $regex: keywords.join('|'), $options: 'i' } },
          { about: { $regex: keywords.join('|'), $options: 'i' } }
      ]
  };

  const collaborators = await collaboratorsModel.find(query);
  if(!collaborators||collaborators.length===0){
    return res.status(400).json({message:"no collaborator found"})
  }

  
   return res.status(200).json({
      message: 'Collaborators found',
      data: collaborators
  })


  }
  catch(err){
    console.log(err)
    return res.status(400).json({message:err.message})
  }

}