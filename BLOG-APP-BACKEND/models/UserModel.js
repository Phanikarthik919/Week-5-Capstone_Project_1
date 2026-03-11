import {Schema , model} from 'mongoose'


// User type Schema models
const userSchema = new Schema({

  firstName:{
    type:String,
    required:[true,"First name is required"],
    minLength:[3, "First name must be at least 3 characters"],
    maxLength:[20, "First name cannot exceed 20 characters"]
  },
  lastName:{
    type:String,
    minLength:[3, "Last name must be at least 3 characters"],
    maxLength:[20, "Last name cannot exceed 20 characters"]
  },
  email:{
    type:String,
    required:[true,"email is required"],
    unique:[true,"Email already existed"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    minLength:[8, "Password must be at least 8 characters"]
  },
  profileImageUrl:{
    type:String
  },
  role:{
    type:String,
    enum:["AUTHOR","USER","ADMIN"],
    required:[true,"Role is required"] 
  },
  isActive:{
    type:Boolean,
    default:true
  }
},{
  timestamps:true,
  strict:"throw",
  versionKey:false
})


//create model
export const UserTypeModel = model("user" , userSchema)