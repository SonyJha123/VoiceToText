import express from "express";
import { createUser, deleteUser, getAllUser, getUserById, login, updateUser } from "../controller/userController.js";
import { uploadSingleImage } from "../helpers/multer.js"
const router = express.Router()

router.post("/",uploadSingleImage.single('image'),createUser)
router.get("/alluser",getAllUser)
router.get("/userbyid/:id",getUserById)
router.put("/:id",uploadSingleImage.single('image'),updateUser)
router.delete("/:id",deleteUser)
router.post("/login", login)

export default router