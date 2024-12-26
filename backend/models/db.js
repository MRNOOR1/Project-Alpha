const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://mrnoori:FRyxBmK6j43YD8UW@alpha.uw4tq.mongodb.net/"; // Replace with your MongoDB connection URI
const client = new MongoClient(uri, { useUnifiedTopology: true }); // Use the unified topology
const dbName = "Alpha"; // Replace with your database name

// Function to connect to MongoDB and return the database object
async function connectToDb() {
  try {
    // Connect to the client (no need to check isConnected())
    if (!client.isConnected) {
      await client.connect(); // Establish the connection
    }

    const db = client.db(dbName); // Get the database instance
    console.log("Connected to MongoDB");
    return db; // Return the database object
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err; // Propagate the error
  }
}

// Export the connectToDb function to be used elsewhere
module.exports = { connectToDb };
