import { ADDRGETNETWORKPARAMS } from 'dns';

// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

//   * List a set of menu options:

//     * View Products for Sale

//     * View Low Inventory

//     * Add to Inventory

//     * Add New Product




//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.


var inquirer = require('inquirer');
var mysql = require("mysql");

//code to connect and retrieve information from mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "mysql2018",
    database: "web_storeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
});


// connection.end();
function manager(res) {
    inquirer.prompt([
        {
            type: "list",
            name: "manager",
            message: "Managerial Duty",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        },
    ]).then(function (manager) {

        switch (manager) {
            case "View Products for Sale":
                viewSale();
                break;
            case "View Low Inventory":
                lowInvientory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNew();
                break;
        }
    });
}
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
function viewSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " | " + "$" + res[i].price);
        }
    });
}
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function lowInvientory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " | " + "$" + res[i].price);
        }
    });
}
//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory() {
    inquirer.prompt([
        {
            type: "list",
            name: "more",
            message: "Which item are you updating?",
            choices: ["guitar", "bass", "drums", "tent", "sleeping bag", "sleeping mat", "tofu", "seitan", "cliff bar", "wraps"]  //can we get this to populate?
        },
        {
            name: "amount",
            message: "How many?"
          }
    ]).then(function (answer) {
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.choice) {
            chosenItem = res[i];
          }
        }
        if (chosenItem.stock_quantity >= answer.amount) {
          completeOrder(chosenItem,answer);
        } else {
          console.log("Sorry, we only have " + chosenItem.stock_quantity + " " +
            chosenItem.product_name + "s in stock");
            purchaseRequest(res);
        }
      });
    }
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function addNew() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " | " + "$" + res[i].price);
        }
    });
}