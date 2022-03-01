const { connect } = require("../database/connection");
const bcrypt = require("bcrypt");

// ----------------------------Check if user exists in our database--------------
module.exports.isUser = async (email) =>
  new Promise((resolve, reject) => {
    connect.query(
      `SELECT * FROM users WHERE email="${email}"`,
      (err, result, fields) => {
        if (err) return reject(false);

        if (result.length) return resolve(true);

        return resolve(false);
      }
    );
  });

// ----------------------------Check if add user to  database database-------------
module.exports.addUser = async (data) =>
  new Promise(async (resolve, reject) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    var sql = `INSERT INTO users (name, email, password, verification_code) values ("${data.name}","${data.email}", "${password}","${code}")`;
    connect.query(sql, (err, result, fields) => {
      if (err) return reject(null);
      return resolve(this.getUserById(result.insertId));
    });
  });

//-----------------------------------Get a user by his ID----------------------------
module.exports.getUserById = async (id) =>
  new Promise((resolve, reject) =>
    connect.query(
      `SELECT * FROM users WHERE id="${id}" LIMIT 1`,
      (err, result, fields) => {
        if (err) return reject(null);

        if (result.length) return resolve(result[0]);

        return resolve(null);
      }
    )
  );

//-----------------------------------Get a user by his ID----------------------------
module.exports.getUserByEmail = async (email) =>
  new Promise((resolve, reject) =>
    connect.query(
      `SELECT * FROM users WHERE email="${email}" LIMIT 1`,
      (err, result, fields) => {
        if (err) return reject(null);

        if (result.length) return resolve(result[0]);

        return resolve(null);
      }
    )
  );

// ---------------------------- check if the code is valid----------------------------
module.exports.isCodeValid = async (data) =>
  new Promise((resolve, reject) =>
    connect.query(
      `SELECT * FROM users WHERE verification_code="${data.verification_code}" AND id="${data.id}"`,
      (err, result, fields) => {
        if (err) return reject(false);

        if (result.length) return resolve(true);

        return resolve(false);
      }
    )
  );

//-----------------------Verify user ---------------------------------------------------
module.exports.verifyUser = async (data) =>
  new Promise(async (resolve, reject) => {
    var sql = `UPDATE users set verification_code=null, is_verified="1"`;
    connect.query(sql, (err, result, fields) => {
      if (err) return reject(err);
      return resolve(this.getUserById(data.id));
    });
  });

//------------------------ Check if user is verified ------------------------------------
module.exports.isVerified = async (id) =>
  new Promise((resolve, reject) =>
    connect.query(
      `SELECT * FROM users WHERE id="${id}" AND is_verified="1"`,
      (err, result, fields) => {
        if (err) return reject(false);

        if (result.length) return resolve(true);

        return resolve(false);
      }
    )
  );
