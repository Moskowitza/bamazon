// ### Challenge #2: Manager View (Next Level)

// * Create a new Node application called `bamazonManager.js`. Running this application will:

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
    manager();
});


// connection.end();
function manager() {
    inquirer.prompt([
        {
            type: "list",
            name: "manager",
            message: "Managerial Duty",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        },
    ]).then(function (answer) {

        switch (answer.manager) {
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
            console.log();
            console.log("---------------------------------------------");
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
        }
    });
    manager();
}
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.
function lowInvientory() {
    var query = "SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?";
    connection.query(query, [0, 5], function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].product_name + " | " + "$" + res[i].price);
        }
    });
    manager();
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
        var productAdjust = answer.more;
        var newStock = parseInt(answer.amount);
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStock
                },
                {
                    product_name: answer.more
                }
            ],
            function (error, res) {
                if (error) throw err;
                console.log(res.stock_quanitity);
                viewSale(); 
                manager();

            }
        );
    });
};






//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
function addNew() {
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Product Name"
        },
        {
            type: "input",
            name: "department_name",
            message: "Department Name"
        },
        {
            type: "input",
            name: "price",
            message: "Price",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            name: "stock_quantity",
            message: "Amount of Stock",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
    ]).then(function (answer) {
        var newPrice= parseInt(answer.price)
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.product_name,
                department_name: answer.department_name,
                price: newPrice,
                stock_quantity: answer.stock_quantity
            },
            function (err, res) {
                // console.log(res.affectedRows + " product inserted!\n");
                viewSale(); 
                manager();
            }
        )
        // console.log(query.sql);
    });
};
    // var query = "SELECT * FROM products WHERE ?";
    // connection.query(query, { product_name: answer.more }, function (err, res) {
    //     if (err) throw err;
    //     var chosenItem;
    //     for (var i = 0; i < res.length; i++) {
    //         if (res[i].product_name === answer.more) {
    //             chosenItem = res[i];
    //         }
    //     }

    //     console.log("previous stock ammount: " + chosenItem.stock_quantity);
    //     var newStock = parseInt(chosenItem.stock_quantity) + parseInt(answer.amount);
    //     console.log("new Stock " + newStock);
    //     //update