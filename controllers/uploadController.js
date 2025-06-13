import fs from "fs";
import { getFtpClient } from "../config/ftpClient.js";
import FormSubmission from "../models/FormSubmission.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uniqueName = Date.now() + '-' + req.file.originalname;
  const localPath = req.file.path;

  try {
    const client = await getFtpClient();

    // ✅ Debug FTP login path
    const rootPath = await client.pwd();
    console.log("📁 Logged into:", rootPath); // should show / (meaning public_html)

    // ✅ IMPORTANT: ONLY cd to 'assets' directly — NOT public_html/assets
    await client.cd("assets");

    // ✅ Upload directly into 'assets'
    await client.uploadFrom(localPath, uniqueName);

    // ✅ Cleanup
    await client.close();
    fs.unlinkSync(localPath);

    // ✅ Build public URL
    const fileUrl = `${process.env.FTP_PUBLIC_URL}/${uniqueName}`;
    console.log("✅ Uploaded:", fileUrl);
    res.status(200).json({ fileUrl });
  } catch (err) {
    console.error("❌ FTP Upload Error:", err);
    res.status(500).json({ error: "File upload failed", detail: err.message });
  }
};

export const submitForm = async (req, res) => {
  try {
    const { name, content, fileUrl } = req.body;

    if (!name || !content || !fileUrl) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const submission = new FormSubmission({
      name,
      content,
      fileUrl,
    });

    await submission.save();

    res.status(201).json({ message: "Form submitted successfully", submission });
  } catch (error) {
    console.error("❌ Error submitting form:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ submittedAt: -1 }); // newest first
    res.status(200).json({ submissions });
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await FormSubmission.findById(id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.status(200).json({ submission });
  } catch (error) {
    console.error("❌ Error fetching submission by ID:", error);
    res.status(500).json({ error: "Server error", detail: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await FormSubmission.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Updated", submission: updated });
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await FormSubmission.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};

export const getSubmissionCount = async (req, res) => {
  try {
    const count = await FormSubmission.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("❌ Count error:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
};


