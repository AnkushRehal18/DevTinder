const adminAuth = (req,res,next)=>{
    const token = "XYZ";
    const isAdminAuthorized = token === "XYZ";

    if(!isAdminAuthorized){
        res.status(401).send("unauthorised user");
    }
    else{
        next();
    }
};  


const userAuth = (req,res,next)=>{
    const token = "XYZ";
    const isAdminAuthorized = token === "XYZ";

    if(!isAdminAuthorized){
        res.status(401).send("unauthorised user");
    }
    else{
        next();
    }
};
module.exports ={
    adminAuth,
    userAuth
}