const mongoose=require("mongoose");

const CompanySchema=new mongoose.Schema({
    CompanyName:{
        type:String,
        required:true,
        trim:true,
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
      },
      foundedYear: {
        type: Number,
      },
      activeJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Job",
        },]
      
})

module.exports = mongoose.model("Company", companySchema);