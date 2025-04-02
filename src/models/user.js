const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:3,
        maxLength:100,
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required:true,
        index: true,
        unique: true 
    },
    password:{
        type: String,
        required:true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["Male", "Female", "others"].includes(value)) {
                throw new Error("Gender Data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/ti/vettori-gratis/p1/45944199-maschio-predefinito-segnaposto-avatar-profilo-grigio-immagine-isolato-su-sfondo-uomo-silhouette-immagine-per-utente-profilo-nel-sociale-media-forum-chiacchierare-in-scala-di-grigi-illustrazione-vettoriale.jpg",
    },
    about: {
        type: String,
        default: "this is the default value for the user",
    },
    skills: {
        type: [String]
    }
} ,{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);