"use strict";
/*jshint esversion: 8 */
/*jshint -W079 */
const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { ObjectID } = require("mongodb");
const User = function (data, avatar, author, websiteUrl) {
  this.data = data;
  this.avatar = avatar;
  this.author = author;
  this.websiteUrl = websiteUrl;
  this.errors = [];
};
let date = new Date();
let salt = bcrypt.genSaltSync(10);
User.prototype.validate = function () {
  if (this.data.email == "") {
    this.errors.push("email should not be empty");
  }
  if (this.data.username == "") {
    this.errors.push("Username should not be empty");
  }
  if (this.data.username.length > 0 && this.data.username.length > 50) {
    this.errors.push("Username should not exceed 50 chracters");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("email is not valid");
  }
  if (this.data.password == "") {
    this.errors.push("password should not be empty");
  }
  if (this.data.password.length > 0 && this.data.password < 6) {
    this.errors.push("password should be more than 6 charachters");
  }
  if (this.data.password.length > 0 && this.data.password < 50) {
    this.errors.push("password should not exceed 50 charachters");
  }
};
User.prototype.validate_for_profile_info = function () {
  if (this.data.name == "") {
    this.errors.push("Name should not be empty");
  }
  if (validator.isNumeric(this.data.name)) {
    this.errors.push("Sorry. Name should not have numbers");
  }
  if (this.data.email == "") {
    this.errors.push("email should not be empty");
  }
  if (this.data.name.length > 0 && this.data.name.length > 50) {
    this.errors.push("Username should not exceed 50 chracters");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("email is not valid");
  }
};
User.prototype.validate_login = function () {
  if (this.data.username == "") {
    this.errors.push("Username should not be empty");
  }
  if (this.data.username.length > 0 && this.data.username.length > 50) {
    this.errors.push("Username should not exceed 50 chracters");
  }
  if (this.data.password == "") {
    this.errors.push("password should not be empty");
  }
  if (this.data.password.length > 0 && this.data.password < 6) {
    this.errors.push("password should be more than 6 charachters");
  }
  if (this.data.password.length > 0 && this.data.password < 50) {
    this.errors.push("password should not exceed 50 charachters");
  }
};
User.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.validate();
    if (this.errors.length) {
      reject(this.errors);
    } else {
      if (this.data.terms == "on") {
        this.data.terms = 1;
      } else {
        this.data.terms = 0;
      }
      if (this.data.terms == 0) {
        reject(" 🙄 You Have to Agree With terms and conditions 🙄");
      }
      this.data = {
        name: "",
        username: this.data.username,
        email: this.data.email,
        password: bcrypt.hashSync(this.data.password, salt),
        role: "user",
        avatar: {},
        terms: this.data.terms,
        website_url: "",
        country: "",
        about: "",
        email_notif: "",
        created_at: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        updated_at: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
      };
      await usersCollection
        .findOne({ email: this.data.email })
        .then(async user => {
          if (user && user.email == this.data.email) {
            if (user.username == this.data.username) {
              reject("😡 Username already taken 🙄");
            }
            reject("😡 Email already taken 🙄");
          } else {
            await usersCollection.insertOne(this.data);
            resolve("😁 Account Created 😎");
          }
        })
        .catch(err => {
          reject(err);
        });
    }
  });
};
User.prototype.access = function () {
  return new Promise(async (resolve, reject) => {
    this.validate_login();
    if (this.errors.length) {
      reject(this.errors);
    } else {
      await usersCollection.findOne({ username: this.data.username }, (err, client) => {
        if (client && client.username == this.data.username && bcrypt.compareSync(this.data.password, client.password)) {
          resolve(client);
        } else {
          reject("🤔 Invalid Username / Password 😏");
        }
      });
    }
  });
};
User.prototype.avatar_image = function () {
  return new Promise(async (resolve, reject) => {
    let isdo213 = this.avatar;

    if (isdo213.mimetype == "image/jpeg" || isdo213.mimetype == "image/jpg" || isdo213.mimetype == "image/png") {
      await usersCollection.updateOne(
        { _id: ObjectID(this.author._id) },
        {
          $set: {
            avatar: this.avatar
          }
        }
      );
      resolve(this.avatar);
    } else {
      reject("🤔 Sorry. Please Upload an image format like jpeg/jpg/png 😏");
    }
  });
};
User.prototype.userInfo_update = function () {
  return new Promise(async (resolve, reject) => {
    this.validate_for_profile_info();
    if (this.errors.length) {
      reject(this.errors);
    } else {
      if (this.data.new_password == "" && this.data.new_repeat_password == "") {
        this.data.new_password = "";
      } else {
        if (this.data.new_password == "") {
          this.errors.push("password should not be empty");
        }
        if (this.data.new_password.length > 0 && this.data.new_password < 6) {
          this.errors.push("password should be more than 6 charachters");
        }
        if (this.data.new_password.length > 0 && this.data.new_password < 50) {
          this.errors.push("password should not exceed 50 charachters");
        }
        if (this.data.new_repeat_password == "") {
          this.errors.push("confirm password should not be empty");
        }
        if (this.data.new_repeat_password.length > 0 && this.data.new_repeat_password < 6) {
          this.errors.push("confirm password should be more than 6 charachters");
        }
        if (this.data.new_repeat_password.length > 0 && this.data.new_repeat_password < 50) {
          this.errors.push("confirm password should not exceed 50 charachters");
        }
        if (this.data.new_password != this.data.new_repeat_password) {
          this.errors.push("password do not match");
        }
      }
      if (this.data.length) {
        reject(this.data);
      } else {
        if (this.data.new_password != "" || this.data.new_password != null) {
          await usersCollection.updateOne(
            { _id: ObjectID(this.author._id) },
            {
              $set: {
                name: this.data.name,
                password: bcrypt.hashSync(this.data.new_password),
                retype_password: bcrypt.hashSync(this.data.new_password),
                email: this.data.email,
                website_url: this.data.website_url,
                country: this.data.country,
                about: this.data.about,
                show_balance: this.data.show_balance,
                email_notif: this.data.email_notif,
                updated_at: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
              }
            }
          );
        } else {
          await usersCollection.updateOne(
            { _id: ObjectID(this.author._id) },
            {
              $set: {
                name: this.data.name,
                email: this.data.email,
                website_url: this.data.website_url,
                country: this.data.country,
                about: this.data.about,
                show_balance: this.data.show_balance,
                email_notif: this.data.email_notif,
                updated_at: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
              }
            }
          );
        }
        resolve(this.data);
      }
    }
  });
};
User.prototype.user_socialMedias = function () {
  return new Promise(async (resolve, reject) => {
    await usersCollection.updateOne(
      { _id: ObjectID(this.author._id) },
      {
        $set: {
          social_fb_link: this.data.social_fb_link,
          social_twt_link: this.data.social_twt_link,
          social_gplus_link: this.data.social_gplus_link,
          social_rss_link: this.data.social_rss_link,
          social_db_link: this.data.social_db_link,
          social_be_link: this.data.social_be_link,
          social_de_link: this.data.social_de_link,
          updated_at: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        }
      }
    );
    resolve();
  });
};
User.prototype.user_validation_for_billing = function () {
  if (this.data.first_name2 == "") {
    this.errors.push("First Name should not be empty");
  }
  if (validator.isNumeric(this.data.first_name2)) {
    this.errors.push("Sorry. First Name should not have numbers");
  }
  if (this.data.first_name2.length > 0 && this.data.first_name2.length > 50) {
    this.errors.push("First should not exceed 50 chracters");
  }
  if (this.data.last_name2 == "") {
    this.errors.push("Last Name should not be empty");
  }
  if (validator.isNumeric(this.data.last_name2)) {
    this.errors.push("Sorry. Last Name should not have numbers");
  }
  if (this.data.last_name2.length > 0 && this.data.last_name2.length > 50) {
    this.errors.push("Last should not exceed 50 chracters");
  }
  if (!validator.isEmail(this.data.email_address2)) {
    this.errors.push("Email is not valid");
  }
};
User.prototype.userBillingInfos = function () {
  this.user_validation_for_billing();
  return new Promise(async (resolve, reject) => {
    if (this.errors.length) {
      reject(this.errors);
    } else {
      await usersCollection.updateOne(
        { _id: ObjectID(this.author._id) },
        {
          $set: {
            billingInfos: {
              first_name2: this.data.first_name2,
              last_name2: this.data.last_name2,
              company_name2: this.data.company_name2,
              email_address2: this.data.email_address2,
              country2: this.data.country2,
              state2: this.data.state2,
              zipcode2: this.data.zipcode2,
              address2: this.data.address2,
              notes2: this.data.notes2,
              copy_shipping: this.data.copy_shipping
            },
            updated_at: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
          }
        }
      );
      resolve();
    }
  });
};

User.prototype.becomeSeller = function () {
  return new Promise(async (resolve, reject) => {
    await usersCollection.updateOne(
      { _id: ObjectID(this.author) },
      {
        $set: {
          role: "author"
        }
      }
    );
    resolve();
  });
};
User.prototype.passwordForgot = function () {
  return new Promise(async (resolve, reject) => {
    await usersCollection.findOne({ email: this.data.email }, async (err, founded) => {
      if (founded) {
        ("use strict");
        const nodemailer = require("nodemailer");
        let theCode = Math.floor(Math.random() * 1000000000);
        let theWebsite = this.websiteUrl;
        let theEmail = this.data.email;
        await usersCollection.updateOne(
          { email: founded.email },
          {
            $set: {
              website_url: theCode
            }
          }
        );
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "olga.kohler25@ethereal.email", // generated ethereal user
              pass: "XX1zR5KnvySDy5ScKt" // generated ethereal password
            }
          });

          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: founded.email, // list of receivers
            subject: `${theWebsite}/${theEmail}/${theCode}`, // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>" // html body
          });

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);

        resolve();
      } else {
        console.log(err);
        reject();
      }
    });
  });
};

User.prototype.checkIfCodeFromEmailIsTrue = function (req, res) {
  return new Promise(async (resolve, reject) => {
    await usersCollection.findOne({ email: this.data.email }, async (err, founded) => {
      if (founded && founded.websiteUrl === this.data.code) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

module.exports = User;
