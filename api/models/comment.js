import mongoose from "mongoose";

const { Schema } = mongoose;

const Comment = new Schema({
  content: String,
  postId: String,
  author: String,
  points: Number
});

export default mongoose.model("Comment", Comment);
