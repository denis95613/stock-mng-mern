import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import pdf from "html-pdf";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";

import userRoutes from "./routes/userRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import manageWordsRoutes from "./routes/manageWordsRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import pdfTemplate from "./documents/reports.js";

dotenv.config();

const app = express();

const DB_URL = process.env.DB_URL;
console.log(DB_URL);
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB has been connected"))
  .catch((error) => console.log(error.message));
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "./client/build")));
// app.get("/*", function (request, response) {
//   response.sendFile(path.join(__dirname, "./client/build", "index.html"));
// });

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/users", userRoutes);
app.use("/config", configRoutes);
app.use("/managewords", manageWordsRoutes);
app.use("/reports", reportsRoutes);

var options = { format: "A4" };

app.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), options).toFile("report.pdf", (err) => {
    if (err) {
      console.log(err);
      res.send(Promise.reject());
    } else {
      res.send(Promise.resolve());
    }
  });
});

app.post("/fetch-pdf", (req, res) => {
  res.download(`${__dirname}/report.pdf`);
});

app.post("/send-pdf", (req, res) => {
  const { email } = req.body;
  console.log(email);

  // pdf.create(pdfTemplate(req.body), {}).toFile('report.pdf', (err) => {
  pdf.create(pdfTemplate(req.body), options).toFile("report.pdf", (err) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    let pathToAttachment = `${__dirname}/report.pdf`;
    let attachment = fs.readFileSync(pathToAttachment).toString("base64");
    sgMail
      .send({
        from: process.env.FROM_EMAIL,
        to: `${email}`, // list of receivers
        subject: `Report from ΛΕΞΟΚΑΤΑΣΚΕΥΑΣΤΗΣ`, // Subject line
        html: `<p>You received reports from ΛΕΞΟΚΑΤΑΣΚΕΥΑΣΤΗΣ application.</p>`,
        attachments: [
          {
            content: attachment,
            filename: "report.pdf",
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      })
      .then(
        () => {},
        (error) => {
          console.error("--->Mail Error: ", error);
        }
      );

    if (err) {
      console.log("---> Error:", err);
      res.send(Promise.reject());
    } else {
      console.log("---> Success!");
      res.send(Promise.resolve());
    }
  });
});

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
