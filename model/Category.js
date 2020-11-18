"use strict";
/*jshint esversion: 8 */
/*jshint -W079 */
const categoryCollection = require("../db").db().collection("categories");
const { ObjectID } = require("mongodb");
const Category = function (category, author, categoryId, catSlug) {
  this.category = category;
  this.author = author;
  this.categoryId = categoryId;
  this.catSlug = catSlug;
  this.errors = [];
};
let date = new Date();
Category.prototype.validateCategory = function () {
  if (this.category.name == "") {
    this.errors.push("Name field should not be empty");
  }
};
Category.prototype.add = function () {
  return new Promise(async (resolve, reject) => {
    this.validateCategory();
    if (this.errors.length) {
      reject(this.errors);
    } else {
      this.category = {
        author: ObjectID(this.author),
        name: this.category.name,
        slug: this.category.name.toLowerCase().replace(" ", "-").trim(),
        created_at: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        updated_at: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
      };
      await categoryCollection
        .findOne({ slug: this.category.name })
        .then(async founded => {
          if (founded) {
            reject("Category already exists");
          } else {
            await categoryCollection.insertOne(this.category);
            resolve();
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
};
Category.prototype.edit = function () {
  return new Promise(async (resolve, reject) => {
    this.validateCategory();
    if (this.errors.length) {
      reject(this.errors);
    } else {
      await categoryCollection.updateOne(
        { _id: ObjectID(this.categoryId) },
        {
          $set: {
            author: ObjectID(this.author),
            name: this.category.name,
            slug: this.category.name.toLowerCase().replace(" ", "-").trim(),
            updated_at: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " @ " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
          }
        }
      );
      resolve();
    }
  });
};
Category.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    await categoryCollection.deleteOne({ _id: ObjectID(this.categoryId) });
    resolve();
  });
};
Category.prototype.bulkDelete = function () {
  return new Promise(async (resolve, reject) => {
    this.category.forEach(async function (cat) {
      await categoryCollection.deleteOne({ _id: ObjectID(cat) });
    });
  });
};
Category.prototype.deleteAll = function () {
  return new Promise(async (resolve, reject) => {
    await categoryCollection.deleteMany();
    resolve();
  });
};
module.exports = Category;
