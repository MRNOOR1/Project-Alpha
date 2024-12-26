/**
 * MongoDB Tasks Collection Setup
 *
 * This script manages the `tasks` collection in MongoDB, which stores information about individual tasks.
 *
 * - `createTasksCollection`: Sets up the `tasks` collection and creates indexes for efficient querying.
 * - `addTask`: Adds a new task document to the `tasks` collection with details like title, assignee, due date, project reference, dependencies, and description.
 * - `getTasksByProject`: Retrieves all tasks associated with a specific project.
 * - `updateTask`: Updates a task document with new information and tracks the update timestamp.
 *
 * Notes:
 * - Indexing `assignee_id` and `project_id` ensures fast lookups for queries involving tasks assigned to specific users or associated with specific projects.
 * - Tasks include `created_at` and `updated_at` fields to track timestamps for creation and updates.
 */

const { connectToDb } = require("./db");

// Function to create the 'tasks' collection and ensure indexes
async function createTasksCollection() {
  const db = await connectToDb(); // Connect to the database
  const tasksCollection = db.collection("tasks"); // Access or create the 'tasks' collection

  // Ensure indexes for `assignee_id` and `project_id` for optimized queries
  await tasksCollection.createIndex({ assignee_id: 1 });
  await tasksCollection.createIndex({ project_id: 1 });

  console.log("Tasks collection is set up."); // Log confirmation
}

// Function to add a task to the 'tasks' collection
async function addTask(
  title,
  assigneeId,
  dueDate,
  projectId,
  dependencies,
  description
) {
  const db = await connectToDb(); // Connect to the database
  const tasksCollection = db.collection("tasks"); // Access the 'tasks' collection

  // Insert a new task document into the collection
  const result = await tasksCollection.insertOne({
    title, // Mandatory task title
    assignee_id: assigneeId || null, // Reference to Users._id (assignee of the task, optional)
    due_date: dueDate ? new Date(dueDate) : null, // Convert due date to a Date object (optional)
    project_id: projectId || null, // Reference to Projects._id (associated project, optional)
    dependencies: dependencies || null, // Dependencies (e.g., task IDs or descriptions, optional)
    description: description || null, // Task description (optional)
    created_at: new Date(), // Timestamp when the task was created
    updated_at: new Date(), // Timestamp for the last update
  });

  console.log("Task added successfully:", result.insertedId); // Log the ID of the added task
  return result.insertedId; // Return the inserted task's ID
}

// Function to retrieve tasks by project
async function getTasksByProject(projectId) {
  const db = await connectToDb(); // Connect to the database
  const tasksCollection = db.collection("tasks"); // Access the 'tasks' collection

  // Query to find all tasks associated with a specific project
  const tasks = await tasksCollection
    .find({ project_id: projectId }) // Filter tasks by `project_id` field
    .toArray(); // Convert the result to an array

  return tasks; // Return the array of tasks
}

// Function to update a task
async function updateTask(taskId, updates) {
  const db = await connectToDb(); // Connect to the database
  const tasksCollection = db.collection("tasks"); // Access the 'tasks' collection

  // Update the task document with provided fields
  const result = await tasksCollection.updateOne(
    { _id: taskId }, // Filter by task ID
    {
      $set: {
        ...updates, // Apply provided updates
        updated_at: new Date(), // Automatically set the update timestamp
      },
    }
  );

  console.log(
    `Task with ID ${taskId} updated. Modified count:`,
    result.modifiedCount
  ); // Log the number of modified documents
  return result.modifiedCount; // Return the count of modified documents
}

module.exports = {
  createTasksCollection,
  addTask,
  getTasksByProject,
  updateTask,
};
