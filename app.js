const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
// DB
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"))

// mongodb+srv://admin-suraj:<password>@cluster0.ckltw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect("mongodb+srv://admin-suraj:suraj1234@cluster0.ckltw.mongodb.net/todolistDB", {useNewUrlParser: true});

// DataBase Schema
const itemsSchema = {
  item: String
};

// Mongoose Model (<singularVersionOfCollectionName>, <SchemaName>)
const Item = mongoose.model("Item", itemsSchema)

// Manually Adding Item to DB
const Item1 = new Item ({
  item: "Welcome to todolist !"
});

const Item2 = new Item ({
  item: "Hit the + button to add a new item."
});

const Item3 = new Item ({
  item: "<-- Hit this to delete an item."
});

const defaultItems = [Item1, Item2, Item3];

// *********** Dynamic Multiple Lists Schema ***********

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

// var newItems = ["Buy Food", "Cook Food", "Eat Food"]
//
// var workItems = [];


// ********** SINGLE LISTS ***********

// INSERT RECORD

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        console.log(err);
        if (err) {
          console.log("Default Items Added Sucessfully to DB.");
        } else {
        }
      });
      res.redirect("/");

    } else {
      // console.log(foundItems);
      let day = date.getDate();

      // render is ejs method it will render context to list.ejs
      res.render("list", {listTitle: day, newlistItem: foundItems});
    }

  });

});

app.post("/", (req, res) => {
  let newItem = req.body.newItem;
  console.log(newItem);
  let listName = req.body.list;
  console.log(listName);

  const item = new Item({
    item: newItem
  });

  let day = date.getDate();

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }

  // item.save()
  // res.redirect("/")


  // if (req.body.list === "work") {
  //   workItems.push(newItem);
  //   res.redirect("/work");
  // } else {
  //   newItems.push(newItem);
  //   res.redirect("/");
  // }
  // console.log(req.body.newItem);

  // newItems.push(newItem)
  // res.redirect("/")
  // res.render("list", {newlistItem: newItem});
})

// DELETE RECORDS

app.post("/delete", function(req, res) {
  console.log(req.body.checkbox);
  const checkedItemId = req.body.checkbox;

  // Dynamic List Delete
  const listName = req.body.listName;

  let day = date.getDate();

  if (listName === day) {

    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(" Item SuccessFully Deleted !");
        res.redirect("/")
      }
    })

  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/"+ listName)
      }
    })
  }



});


// ************** Dynamic Multiple Lists **************

app.get("/:customListName", (req, res) => {
  console.log(req.params.customListName);

  const customListName = _.capitalize(req.params.customListName)

  List.findOne({name: customListName}, function (err, foundList) {
    if (!err) {
      if (!foundList){
        console.log("Doesn't exists!");

        // CREATE A NEW LIST
        const list = new List({
          name: customListName,
          items: defaultItems
        })

        list.save();
        res.redirect("/"+customListName)

      } else {
        console.log("Exists!");

        // SHOW AN EXISTING LIST

        res.render("list", {listTitle: foundList.name, newlistItem: foundList.items})
      }
    }
  })

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

// ABOUT US

app.get("/about", (req, res) => {
  res.render("about")
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
