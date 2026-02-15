const database = include("/databaseConnection");

const bcrypt = require("bcrypt");
const saltRounds = 12;
async function addUser(postData) {
  let hashedPassword = await bcrypt.hash(postData.password, saltRounds);
  let sqlInsertUser = `
INSERT INTO web_user (first_name, last_name, email, password_hash)
VALUES (:first_name, :last_name, :email, :hashedPassword);
`;
  let params = {
    first_name: postData.first_name,
    last_name: postData.last_name,
    email: postData.email,
    hashedPasword: hashedPassword,
  };
  console.log(sqlInsertUser);
  try {
    const results = await database.query(sqlInsertUser, params);
    let insertedID = results[0].insertId;
    console.log("🙋Inserted new user with ID:");
    console.log(insertedID);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getAllUsers() {
  let sqlQuery = `
		SELECT * FROM web_user;
	`;

  try {
    const results = await database.query(sqlQuery);
    console.log(results[0]);
    return results[0];
  } catch (err) {
    console.log("Error selecting from user table");
    console.log(err);
    return null;
  }
}

module.exports = { getAllUsers, addUser };
