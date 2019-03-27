# Bamazon
![alt text](bamazon.gif "bamazon display")
## Description
Command-line application that mimic the functionality of an online store. The user can choose to purchase item available in the inventory and the application will return the total price and deduct the quantity in the inventory.

## Set Up
+ install node packages that is listed as dependencies in package.json
+ use schema.sql to set up inventory database in mySQL
+ use seed.sql to insert items into database.
+ run node bamazonCustomer.js in terminal to initiate app

## Technologies Used
+ Javascript
+ mySQL
+ Node.js
    + inquirer package
    + cli-table 2 package
    + mysql package

## Code Snippet

The code below select the price and stock_quantity from the database using mysql where the item id matches with what the user input. Then the application will compare the stock quantity to the desired purchase amount. If there is enough item in stock, the application will update the database by deducting the stock quantity. Else, then the inventory will be display again and prompt the user through the whole process.
```
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
```

## Developers
- Samuel Yu (Initial Work)