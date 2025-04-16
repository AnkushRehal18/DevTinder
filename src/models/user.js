const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        index: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value);
            }
        }
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
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo url" + value);
            }
        }
    },
    about: {
        type: String,
        default: "this is the default value for the user",
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$790", {
        expiresIn: "1d",
    });

    return token;
};

userSchema.methods.ValidatePassword = async function(passwordInputByUser){
    const user = this ;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}
// const User = mongoose.model("User",userSchema);
module.exports = mongoose.model("User", userSchema);