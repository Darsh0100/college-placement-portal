const company=require("../models/company");


const saveCompanyDetails=async(req,res)=>{
    try{
        const{CompanyName,CompanyEmail,companyWebsite,industry,description}=req.body;

        // Validation check for empty inputs
        if (!CompanyName || !CompanyEmail || !companyWebsite || !industry || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // check multiple uniqueness conditions
        const existingCompany = await company.findOne({
            $or: [
                { userId: req.user.id },       // Condition 1: Does this recruiter already own a company?
                { CompanyName: CompanyName }, // Condition 2: Does this company name already exist globally?
                { CompanyEmail: CompanyEmail } // Condition 3: Is this email already registered to a company?
            ]
        });
        if (existingCompany) {
            // Provide a dynamic error message so the user knows exactly what failed
            let errMsg = "Registration failed.";
            if (existingCompany.userId.toString() === req.user.id) {
                errMsg = "You have already registered a company profile.";
            } else if (existingCompany.CompanyName === CompanyName) {
                errMsg = "A company with this name is already registered.";
            } else if (existingCompany.CompanyEmail === CompanyEmail) {
                errMsg = "This company email is already in use.";
            }

            return res.status(400).json({
                success: false,
                message: errMsg,
            });
        }

        const newCompany=await company.create({
            userId: req.user.id,
            CompanyName,
            CompanyEmail,
            companyWebsite,
            industry,
            description,
        })
        res.status(201).json({
            message: "Company Registered Successfully",
            newCompany,
          });
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:err.message,
        })
    }
}

module.exports={
    saveCompanyDetails
}