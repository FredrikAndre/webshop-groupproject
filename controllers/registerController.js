const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");

const renderRegister = (req, res) => {
    try {
    res.render("user/register.ejs");
    } catch (err) {
        console.log(err);
    };
};

const submitRegister = async (req, res) => {
    
    const {error} = validateUser(req.body);
    const { username, email, password } = req.body;
    let errors = [];

    try {
        if (error) {
        return errors.push({msg: error.details[0].message}),
        res.render("user/register.ejs", {
            errors,
            error
        })
        }

        const userMail = await User.findOne({ email: email });
        const userName = await User.findOne({ username: username });
        if (userName) {
            return errors.push({ msg: "This username already exists, please try another." }),
            res.render('user/register.ejs', {
                errors,
                userName,
            });
        } 
        if (userMail) {
            return errors.push({ msg: "This email already exists, please try another." }),
            res.render('user/register.ejs', {
                  errors,
                  userMail,
            });
        } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await new User({ 
            username: username, 
            email: email, 
            password: hashedPassword 
        }).save();
        res.redirect("/login");
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    renderRegister,
    submitRegister
  };