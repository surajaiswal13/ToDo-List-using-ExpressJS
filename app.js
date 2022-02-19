const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static("public"))

var newItems = ["Buy Food", "Cook Food", "Eat Food"]

var workItems = [];

app.get("/", (req, res) => {

  let day = date();

  // render is ejs method it will render context to list.ejs
  res.render("list", {listTitle: day, newlistItem: newItems});

});

app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  if (req.body.list === "work") {
    workItems.push(newItem);
    res.redirect("/work");
  } else {
    newItems.push(newItem);
    res.redirect("/");
  }
  console.log(req.body.newItem);

  // newItems.push(newItem)
  // res.redirect("/")
  // res.render("list", {newlistItem: newItem});
})

// WORK SECTION

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "work", newlistItem: workItems});
});

// app.post("/work", (req, res) => {
//   let item = req.body.newItem;
//   workItems.push(item);
//   res.redirect("/work");
// })

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// ABOUT US

app.get("/about", (req, res) => {
  res.render("about")
})
