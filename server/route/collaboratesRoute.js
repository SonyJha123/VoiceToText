import express from "express"
import {  Collaborator_login, creatCollaborator, deleteCollaborator, getCollaboratorbyId, getcollaboratorsbyKeywords, getkeywordsbytext, updateCollaborator } from "../controller/collaboratorsController.js"
import { uploadSingleImage } from "../helpers/multer.js"

const router = express.Router()
router.post("/",uploadSingleImage.single('image'),creatCollaborator);
router.put("/update/:id",uploadSingleImage.single('image'),updateCollaborator)
router.get("/getbyId/:id",getCollaboratorbyId)
router.delete("/delete/:id",deleteCollaborator);
router.post("/login",Collaborator_login)
router.get("/getbykeywords",getcollaboratorsbyKeywords)
router.get("/kewwords_from_text",getkeywordsbytext)
export default router