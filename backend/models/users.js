/**
 * MongoDB User Collection Setup
 *
 * This script sets up and manages the `users` collection in MongoDB for an application.
 *
 * - `connectToDb`: A function to establish a connection to the database.
 * - `createUsersCollection`: Ensures the `users` collection is set up with the appropriate indexes for efficient querying.
 * - `addUser`: Adds a new user to the `users` collection with a unique username and email.
 *
 * Note:
 * - Indexes ensure that the `username` and `email` fields are unique across all users.
 * - Passwords should be securely hashed before being stored in the database.
 */

const { connectToDb } = require("./db");

// Function to create the 'users' collection and ensure indexes
async function createUsersCollection() {
  const db = await connectToDb(); // Connect to the database
  const usersCollection = db.collection("users"); // Access or create the 'users' collection

  // Ensure indexes for the 'username' and 'email' fields to enforce uniqueness
  await usersCollection.createIndex({ username: 1 }, { unique: true });
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  console.log("Users collection is set up."); // Log confirmation
}

// Function to add a user to the 'users' collection
async function addUser(username, email, passwordHash) {
  const db = await connectToDb(); // Connect to the database
  const usersCollection = db.collection("users"); // Access the 'users' collection

  // Insert a new user document into the collection
  const result = await usersCollection.insertOne({
    username, // User's unique username
    email, // User's unique email address
    password: passwordHash, // Hashed password for secure storage
    created_at: new Date(), // Timestamp when the user was created
  });

  console.log("User added successfully:", result.insertedId); // Log the ID of the added user
}

module.exports = { createUsersCollection, addUser };
