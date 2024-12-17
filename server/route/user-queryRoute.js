import express from "express";
import { createUserQuery, deleteUserQuery, getAllUserQuery, getUserQueryById, getUserQueryByUserId } from "../controller/user-queryController.js";

const router = express.Router()

router.post("/",createUserQuery)
router.get("/alluserquery",getAllUserQuery)
router.get("/userquerybyid/:id",getUserQueryById)
router.get("/userquerybyuser/:id", getUserQueryByUserId)
router.delete("/:id",deleteUserQuery)
export default router