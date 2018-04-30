// 6. The app should then prompt users with two messages.

//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.

// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.

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

function afterConnection() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].product_name + " | " + "$" + res[i].price);
    }
    purchaseRequest(res)
  });
}
// connection.end();
function purchaseRequest(res) {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What are you buying?",
      choices: ["guitar", "bass", "drums", "tent", "sleeping bag", "sleeping mat", "tofu", "seitan", "cliff bar", "wraps"]  //can we get this to populate?
    },
    {
      name: "amount",
      message: "How many?"
    }
  ]).then(function (answer) {
    // 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
    //grab that response from the database

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

function completeOrder(chosenItem,answer) {
  console.log("good news, We have " + chosenItem.stock_quantity + " " +chosenItem.product_name + "s in stock");
  // * This means updating the SQL database to reflect the remaining quantity.
  console.log("answer.amount "+ answer.amount)
  var adjustment=chosenItem.stock_quantity - answer.amount;
  console.log(adjustment)//so far no error
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: adjustment
      },
      {
        product_name: chosenItem.product_name
      }
    ], 
    function (error,res) {
      if (error) throw err;
      var amountdue = chosenItem.price * answer.amount;
      // * Once the update goes through, show the customer the total cost of their purchase.
      console.log("Your Price: " + amountdue);
      afterConnection();
    }
  );
}