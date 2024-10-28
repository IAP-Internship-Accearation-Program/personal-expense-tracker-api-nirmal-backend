const express = require('express');
var bodyParser = require('body-parser');
const connection =require('./dbConnection/db-connection');

const app = express();
const port = 3000;

app.use(express.json());

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const userRoute = require('./routes/users-routs')
app.use('/api/v1/user',userRoute)








connection.connect(err => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL database');

  // Create the database if it doesn't exist
  connection.query("CREATE DATABASE IF NOT EXISTS expensive_tractor", (err) => {
      if (err) {
          console.error('Error creating database:', err);
          return;
      }
      console.log('Database created or already exists');

      // Use the database for further operations
      connection.changeUser({ database: 'expensive_tractor' }, (err) => {
          if (err) {
              console.error('Error switching to database:', err);
              return;
          }
          console.log('Switched to database expensive_tractor');

          // Create tables if they don't exist
          const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255)
        )
      `;

          const createExpenseTable = `
        CREATE TABLE IF NOT EXISTS expenses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          education DECIMAL(10, 2),
          food DECIMAL(10, 2),
          antitreatment DECIMAL(10, 2),
          transport DECIMAL(10, 2),
          shopping DECIMAL(10, 2),
          other DECIMAL(10, 2),
          date DATE,
          amount DECIMAL(10, 2),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `;

          connection.query(createUserTable, err => {
              if (err) {
                  console.error('Error creating users table:', err);
              } else {
                  console.log('Users table created or already exists');
              }
          });

          connection.query(createExpenseTable, err => {
              if (err) {
                  console.error('Error creating expenses table:', err);
              } else {
                  console.log('Expenses table created or already exists');
              }
          });
      });
  });
});


















app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
