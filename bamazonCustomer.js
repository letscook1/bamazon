const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bamazon_db'
});

connection.connect();

function queryProducts() {
  connection.query('SELECT id, product_name, price FROM products', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;

    console.log('PRODUCTS FOR SALE');
    console.log('===========');

    console.table(results);
    console.log('===========');
    makePurchase();
  });
}

queryProducts();

function makePurchase() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'id',
        message: 'What is the ID of the product you would like to purchase?',
        validate: function(value) {
          var regexp = /^\d+$/;
          return regexp.test(value)
            ? true
            : 'Please enter a number, no letters.';
        }
      },
      {
        type: 'input',
        name: 'quantity',
        message: 'How much of this product do you want?',
        validate: function(value) {
          var regexp = /^\d+$/;
          return regexp.test(value)
            ? true
            : 'Please enter a number, no letters.';
        }
      }
    ])
    .then(function(data) {
      let id = parseInt(data.id);
      connection.query('SELECT * FROM products WHERE id = ' + id, function(
        error,
        results,
        fields
      ) {
        if (error) {
          console.log('Sorry, none of our records match this product ID.');
          newPurchase();
        } else {
          let selectedProduct = results[0];

          if (data.quantity <= selectedProduct.stock_quantity) {
            let newStock = selectedProduct.stock_quantity - data.quantity;
            connection.query(
              'UPDATE products SET stock_quantity = ' +
                newStock +
                ' WHERE id = ' +
                id,
              function(error, results, fields) {
                let totalCost =
                  parseFloat(selectedProduct.price) * parseFloat(data.quantity);
                console.log(
                  'Congrats on your order! Your total is: ' + totalCost
                );
                addSale(id, data.quantity);
                console.log('===========');
                newPurchase();
              }
            );
          } else {
            console.log(
              "There's not enough in stock to fulfill your order, please try again with a lesser amount or order a different product."
            );
            console.log('===========');
            newPurchase();
          }
        }
      });
    });
}

function addSale(product_id, quantity_purchased) {
  connection.query(
    'INSERT INTO sales (product_id, quantity_purchased) VALUES (' +
      product_id +
      ',' +
      quantity_purchased +
      ')',
    function(error, results, fields) {
      if (!error) {
        console.log('Sales sheet successfully updated');
        console.log('===========');
      } else {
        console.log('Something went wrong with creating the sale');
        console.log('===========');
      }
    }
  );
}

function newPurchase() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'purchase',
        message: 'Do you want to make another purchase?'
      }
    ])
    .then(function(data) {
      if (data.purchase) {
        makePurchase();
      } else {
        console.log('Thank you for doing buisiness with us!');
        connection.end();
      }
    });
}
