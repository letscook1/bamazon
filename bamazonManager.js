const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');
let productList = [];
let deptList = [];

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bamazon_db'
});

connection.connect();

function managerMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do, Mr. Manager?',
        choices: [
          'View Products for Sale',
          new inquirer.Separator(),
          'View Low Inventory',
          new inquirer.Separator(),
          'Add To Inventory',
          new inquirer.Separator(),
          'Add New Product',
          new inquirer.Separator(),
          'Exit'
        ]
      }
    ])
    .then(function(data) {
      switch (data.action) {
        case 'View Products for Sale':
          showProducts();
          break;
        case 'View Low Inventory':
          lowInventory();
          break;
        case 'Add To Inventory':
          updateInventory();
          break;
        case 'Add New Product':
          addProduct();
          break;
        case 'Exit':
          console.log('Enjoy your day!');
          connection.end();
          break;
      }
    });
}

managerMenu();

function showProducts() {
  connection.query(
    'SELECT id, product_name, price, stock_quantity FROM products',
    function(error, results, fields) {
      if (error) throw error;

      console.log('PRODUCTS FOR SALE');
      console.log('===========');

      console.table(results);
      returnToMenu();
    }
  );
}

function lowInventory() {
  connection.query(
    'SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5',
    function(error, results, fields) {
      if (error) throw error;

      console.log('PRODUCTS WITH LOW STOCK');
      console.log('===========');

      console.table(results);
      returnToMenu();
    }
  );
}

function updateInventory() {
  connection.query('SELECT product_name FROM products', function(
    error,
    results,
    fields
  ) {
    if (error) throw error;
    productList = [];
    for (var i = 0; i < results.length; i++) {
      productList.push(results[i].product_name);
    }
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'product',
          message: 'What product do you want to add stock to?',
          choices: productList
        },
        {
          type: 'input',
          name: 'quantity',
          message: 'How much of this product do you want to add?',
          validate: function(value) {
            var regexp = /^\d+$/;
            return regexp.test(value)
              ? true
              : 'Please enter a number, no letters.';
          }
        }
      ])
      .then(function(data) {
        let productPicked = data.product;
        connection.query(
          'SELECT id, product_name, stock_quantity FROM products WHERE product_name = "' +
            productPicked +
            '"',
          function(error, results, fields) {
            let selectedProduct = results[0];
            let amountAdded =
              parseInt(selectedProduct.stock_quantity) +
              parseInt(data.quantity);
            connection.query(
              'UPDATE products SET stock_quantity = ' +
                amountAdded +
                ' WHERE id = ' +
                selectedProduct.id,
              function(error, results, fields) {
                if (error) throw error;

                console.log(
                  'Stock for ' +
                    selectedProduct.product_name +
                    ' has been updated!'
                );
                returnToMenu();
              }
            );
          }
        );
      });
  });
}

function addProduct() {
  connection.query('SELECT id, department_name FROM departments', function(
    error,
    res,
    fields
  ) {
    if (error) throw error;
    deptList = [];
    for (var i = 0; i < res.length; i++) {
      deptList.push(res[i].department_name);
    }
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of your product?'
        },
        {
          type: 'list',
          name: 'dept',
          message: 'What department does your product belong to?',
          choices: deptList
        },
        {
          type: 'input',
          name: 'price',
          message: 'What is the price of your product?',
          validate: function(value) {
            var regexp = /^[0-9]+([,.][0-9]+)?$/g;
            return regexp.test(value.toLowerCase())
              ? true
              : 'Please enter a number, no letters.';
          }
        },
        {
          type: 'input',
          name: 'quantity',
          message: 'How much of this product do you have (quantity)?'
        }
      ])
      .then(function(data) {
        let dept;

        for (var i = 0; i < res.length; i++) {
          if (data.dept === res[i].department_name) {
            dept = res[i].id;
          }
        }
        connection.query(
          'INSERT INTO products SET ?',
          {
            product_name: data.name,
            department_id: dept,
            price: data.price,
            stock_quantity: data.quantity
          },
          function(error, results, fields) {
            if (error) return error;
            console.log('New product (' + data.name + ') created!');
            console.log('===========');
            returnToMenu();
          }
        );
      });
  });
}

function returnToMenu() {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'purchase',
        message: 'Would you like to do anything else?'
      }
    ])
    .then(function(data) {
      if (data.purchase) {
        managerMenu();
      } else {
        console.log('Have a nice day!');
        connection.end();
      }
    });
}
