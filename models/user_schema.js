const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// note db properties use snake_case by convention
const userSchema = Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            // mongoose will provide an error for us just by adding this
            unique: [true, "Email already exists"],
            // will make emails lowercase
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    { timestamps: true }
);



userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password, function (result) {
        return result; // returns true or false
    });
};

module.exports = model("User", userSchema);
