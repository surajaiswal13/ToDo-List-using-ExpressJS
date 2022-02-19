const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static("public"))

var newItems = ["Buy Food", "Cook Food", "Eat Food"]

var workItems = [];

app.get("/", (req, res) => {

  var today = new Date();
  // var currentDay = today.getDay();
  // var day = "";
  //
  // // 0 is Sunday and 6 is Saturday
  //
  // if(today.getDay() === 6 || today.getDay() === 0){
  //   // res.write("<h1>Yay it's the weekend!</h1>");
  //   // res.send();
  //
  //   day = "Weekend"
  //
  // }else {
  //   // res.write("<h1>It is not the Weekend</h1>")
  //   // res.write("<h1>Boo, It is a weekday You need to work!</h1>");
  //   // res.send();
  //   // res.sendFile(__dirname + "/index.html")
  //
  //   day = "Weekday"
  //
  // }
  //
  // switch(currentDay) {
  //   case 0:
  //     day = "Sunday";
  //     break;
  //
  //   case 1:
  //     day = "Monday";
  //     break;
  //
  //   case 2:
  //     day = "Tuesday";
  //     break;
  //
  //   case 3:
  //     day = "Wednesday";
  //     break;
  //
  //   case 4:
  //     day = "Thursday";
  //     break;
  //
  //   case 5:
  //     day = "Friday";
  //     break;
  //
  //   case 6:
  //     day = "Saturday";
  //     break;
  //
  //   default:
  //     console.log("This is not a Day : " +currentDay)
  // }
  //

  var options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  var day = today.toLocaleDateString("en-US", options);

  // render is ejs method it will render context to list.ejs
  res.render("list", {listTitle: day, newlistItem: newItems});

});

app.post("/", (req, res) => {
  newItem = req.body.newItem;
  console.log(req.body.newItem);

  newItems.push(newItem)
  res.redirect("/")
  // res.render("list", {newlistItem: newItem});
})

// WORK SECTION

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newlistItem: workItems});
});

app.post("/work", (req, res) => {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
