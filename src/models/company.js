const mongoose=require("mongoose");

const CompanySchema=new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Prevents 1 user from creating multiple companies
  },
    CompanyName:{
        type:String,
        required:true,
        trim:true,
        unique: true,
    },
    CompanyEmail:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    companyWebsite: {
        type: String,
        default: "",
        required:true,
      },
      companyLogo: {
        type: String, // Cloudinary URL
        default: "",
      },
      industry: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        maxlength: 1000,
        required:true,
      },
      foundedYear: {
        type: Number,
      },
      activeJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },]
      
},{ timestamps: true });

module.exports = mongoose.model("Company", CompanySchema);