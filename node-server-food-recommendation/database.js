const mysql = require('mysql');

// Database Connection of MySQL of GCP
let config = {
  user: 'root',
  database: 'reciepe',
  password: 'reciepe',
  host: '34.67.36.176',
  // socketPath: "/cloudsql/project2-309815:us-central1:reciepe"
}

let connection = mysql.createConnection(config);
module.exports = connection;