import { Schema, model } from 'mongoose'


// Create user comment schema
const userCommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comment: {
    type: String
  }
})

//create article Schema
const articleSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Author is required"]
  },
  title: {
    type: String,
    required: [true, "title is required"],
    minLength: [5, "Title must be at least 5 characters long"],
    maxLength: [100, "Title cannot exceed 100 characters"]
  },
  category: {
    type: String,
    required: [true, "category is required"],
    minLength: [2, "Category must be at least 2 characters long"],
    maxLength: [30, "Category cannot exceed 30 characters"]
  },
  content: {
    type: String,
    required: [true, "content is required"],
    minLength: [10, "Content must be at least 10 characters long"]
  },
  comments: [userCommentSchema],
  isArticleActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  strict: "throw",
  versionKey: false
})

export const ArticleModel = model("article", articleSchema);