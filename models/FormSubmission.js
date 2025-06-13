// models/FormSubmission.js
import mongoose from "mongoose";

const FormSubmissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("FormSubmission", FormSubmissionSchema);
