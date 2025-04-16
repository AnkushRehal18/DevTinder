const validator = require('validator');

const validateSignupData = (req)=>{
    const {firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName ){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Not a valid imail");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Use a strong password");
    }
}

const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName","emailId","photoUrl","gender","age","about","skills"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

const validateEditPasswordData = (req)=>{
    const allowedEditFields = ["old_password","new_password"]

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));

    return isEditAllowed;
}

const isUpadtedPasswordStrong = (new_password)=>{
    const isStrongPassword = validator.isStrongPassword(new_password);

    return isStrongPassword;
}
module.exports = {
    validateSignupData,
    validateEditProfileData,
    validateEditPasswordData,
    isUpadtedPasswordStrong,
}