import {Schema , model} from 'mongoose'


// Create user comment schema
const userCommentSchema = new Schema({
  user:{
    type:Schema.Types.ObjectId,
    ref:'user'
  },
  comment:{
    type:String
  }
})

//create article Schema
const articleSchema = new Schema({
  author:{
    type:Schema.Types.ObjectId,
    ref:"user",
    required:[true,"Author is required"]
  },
  title:{
    type:String,
    required:[true,"title is required"]
  },
  category:{
    type:String,
    required:[true,"category is required"]
  },
  content:{
    type:String,
    required:[true,"content is required"]
  },
  coments:[userCommentSchema],
  isArticleActive:{
    type:Boolean,
    default:true
  }
},{
  timestamps:true,
  strict:"throw",
  versionKey:false
})

export const ArticleModel = model("article",articleSchema);