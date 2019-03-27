var mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require('cli-table2');

//establishing connection to database
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "bamazon"
});


connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    displayInventory()
  });




function displayInventory() {
    //query everything from products table and display it as a table in command line using cli-table
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["item id", "product name", "department", "price", "quantity"]
            , colWidths: [10, 30, 20, 10, 10]
        });

        //every object in the response array from query will be generated as an array and push into the table arrary
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity])
        }


        console.log(table.toString());
        
        //variable to be use to validate input for item ID to see if the input is greater than the largest ID number
        var lastItemID = res.length
        customerAction(lastItemID)

    })
}


function customerAction(idNum) {
   
   //ask for user input for item ID number and quantity
    inquirer.prompt([
        {
            message: "What is the item id of the item you would like to purchase?",
            name: "id",
            validate: function (input) {
                if (parseInt(input) <= idNum) {
                    return true
                }
                else {
                    return false
                }
            }
        },
        {
            message: "How many of this item would you like to purchse?",
            name: "quantity",
            //input must be a positive integer
            validate: function (input) {
                if (parseInt(input) > 0) {
                    return true
                }
                else {
                    return false
                }
            }
        }
    ]).then(function(response){
        //query based on item number input by user
        connection.query("SELECT price, stock_quantity FROM products WHERE ?", {item_id:response.id}, function(err, res){
            var itemPrice = res[0].price;
            var amountWant = parseInt(response.quantity)
            if (err) throw err;

            if(res[0].stock_quantity < amountWant){
                console.log("Insufficient quantity!")
                displayInventory()
            }
            
            //updating database by deducting amount purchased
            else {
                connection.query("UPDATE products SET stock_quantity= ? WHERE ?", [res[0].stock_quantity - amountWant,{item_id:response.id}], function(err){
                    if (err) throw err
                    console.log("Your total is $" + (itemPrice * amountWant))
                    displayInventory()
                })
            }
            
        })
    })
}