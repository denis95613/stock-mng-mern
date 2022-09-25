import dotenv from "dotenv";
import fs from "fs";
import Words from "../models/wordModel.js";
dotenv.config();

export const uploadWord = async (req, res) => {
  const word = req.body.word;
  const audio = req.files[0].filename;
  const graphic = req.files[1].filename;
  try {
    const existingWord = await Words.findOne({ word });
    if (existingWord)
      return res.status(400).json({ message: "This word already exist" });
    await Words.create({
      word: word,
      audio: audio,
      graphic: graphic,
    });
    const allWords = await Words.find();
    return res.status(200).json({ allWords });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllWords = async (req, res) => {
  try {
    const allWords = await Words.find().sort({ createdAt: -1 });
    return res.status(200).json({ allWords });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const fileRemover = (file) => {
  const path = `./uploads/${file}`;
  try {
    fs.unlinkSync(path);
  } catch (error) {
    console.log(error);
  }
};

export const deleteWord = async (req, res) => {
  try {
    const { id } = req.params;
    const toRemWord = await Words.findById(id);
    const files = [toRemWord.audio, toRemWord.graphic];
    files.map((file) => {
      fileRemover(file);
    });
    await Words.findByIdAndRemove(id);
    const allWords = await Words.find();
    return res.status(200).json({ allWords });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
