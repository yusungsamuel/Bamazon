var mysql = require("mysql");

var inquirer = require("inquirer");

var Table = require('cli-table2');

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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err

        var table = new Table({
            head: ["item id", "product name", "department", "price", "quantity"]
            , colWidths: [20, 40]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity])
        }


        console.log(table.toString());

    })
}



