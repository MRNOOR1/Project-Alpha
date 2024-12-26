/**
 * MongoDB Projects Collection Setup
 *
 * This script sets up and manages the `projects` collection in MongoDB for an application.
 *
 * - `connectToDb`: A function to establish a connection to the database.
 * - `createProjectsCollection`: Ensures the `projects` collection is set up with the appropriate index for efficient querying.
 * - `addProject`: Adds a new project to the `projects` collection with details like name, description, creator, and timestamp.
 * - `getProjectsByUser`: Retrieves all projects created by a specific user.
 *
 * Note:
 * - Indexing the `created_by` field optimizes lookups for projects associated with specific users.
 * - Projects reference the user who created them via the `created_by` field.
 */

const { connectToDb } = require("./db");

// Function to create the 'projects' collection and ensure indexes
async function createProjectsCollection() {
  const db = await connectToDb(); // Connect to the database
  const projectsCollection = db.collection("projects"); // Access or create the 'projects' collection

  // Ensure an index on the `created_by` field for optimized queries
  await projectsCollection.createIndex({ created_by: 1 });

  console.log("Projects collection is set up."); // Log confirmation
}

// Function to add a project to the 'projects' collection
async function addProject(name, description, createdBy) {
  const db = await connectToDb(); // Connect to the database
  const projectsCollection = db.collection("projects"); // Access the 'projects' collection

  // Insert a new project document into the collection
  const result = await projectsCollection.insertOne({
    name, // Mandatory project name
    description, // Optional project description
    created_by: createdBy, // Reference to Users._id (creator of the project)
    created_at: new Date(), // Timestamp when the project was created
  });

  console.log("Project added successfully:", result.insertedId); // Log the ID of the added project
  return result.insertedId; // Return the inserted project's ID
}

// Function to retrieve projects by user
async function getProjectsByUser(userId) {
  const db = await connectToDb(); // Connect to the database
  const projectsCollection = db.collection("projects"); // Access the 'projects' collection

  // Query to find all projects created by a specific user
  const projects = await projectsCollection
    .find({ created_by: userId }) // Filter projects by `created_by` field
    .toArray(); // Convert the result to an array

  return projects; // Return the array of projects
}

module.exports = { createProjectsCollection, addProject, getProjectsByUser };
