import express from "express";
import multer from "multer";
import fs from "fs";
import {
  uploadWord,
  getAllWords,
  deleteWord,
} from "../controllers/manageWords.js";

const createFolder = (folderName) => {
  try {
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);
  } catch (error) {
    console.log(error);
  }
};

const router = express.Router();

const uploads = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./uploads");
    },
    filename(req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|wav|mp3|mp4|m4a)$/)) {
      return cb(
        new Error("only upload files with jpg, jpeg, png, wav, mp3, mp4, m4a.")
      );
    }
    cb(undefined, true); // continue with upload
  },
});

router.post("/uploadword", uploads.array("files"), uploadWord);
router.post("/getallwords", getAllWords);
router.delete("/deleteword/:id", deleteWord);

export default router;
