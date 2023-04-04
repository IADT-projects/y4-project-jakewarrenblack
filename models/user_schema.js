const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require('passport-local-mongoose');

// note db properties use snake_case by convention
const userSchema = Schema(
    {
        name: {
            type: String,
        },
        googleId: {
            type: String
        },
        email: {
            type: String,
            // mongoose will provide an error for us just by adding this
            unique: [true, "Email already exists"],
            // will make emails lowercase
            lowercase: true,
            trim: true,
        },
        photo: {
            type: String,
        }

    },
    { timestamps: true }
);

// Before saving a user, I want to find out if they've provided a googleID
// If so, they don't need to give a username and password
userSchema.pre('save', async function(next) {
    if (!this.googleId) {
        if (!this.email) {
            return next(new Error('Email is required.'));
        }
    }
    next();
});

userSchema.plugin(findOrCreate)
userSchema.plugin(passportLocalMongoose)


module.exports = model("User", userSchema);
