const { connectToDb } = require("./db");

// Function to create the 'users' collection and ensure indexes
async function createUsersCollection() {
  const db = await connectToDb();
  const usersCollection = db.collection("users");

  // Ensure indexes for username and email fields
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  console.log("Users collection is set up.");
}

// Function to add a user to the 'users' collection
async function addUser(username, email, passwordHash) {
  const db = await connectToDb();
  const usersCollection = db.collection("users");

  // Insert user document into the 'users' collection
  const result = await usersCollection.insertOne({
    username,
    email,
    password: passwordHash,
    created_at: new Date(), // Automatically set the current timestamp
  });

  console.log("User added successfully:", result.insertedId);
}

module.exports = { createUsersCollection, addUser };
