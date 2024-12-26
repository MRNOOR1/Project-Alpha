/**
 * MongoDB Task Assignments Collection Management
 *
 * This script manages the `task_assignments` collection, which tracks the assignment of users to tasks.
 *
 * - `createTaskAssignmentsCollection`: Sets up the collection and ensures indexes for efficient querying.
 * - `assignUserToTask`: Assigns a user to a task and records the timestamp.
 * - `getAssignmentsByTask`: Retrieves all assignments for a specific task.
 * - `getTasksByUser`: Retrieves all tasks assigned to a specific user.
 *
 * Notes:
 * - Indexes on `task_id` and `user_id` enhance performance for lookup operations.
 * - Each assignment includes an `assigned_at` timestamp to track when the assignment was made.
 */

const { connectToDb } = require("./db");

// Function to create the 'task_assignments' collection and ensure indexes
async function createTaskAssignmentsCollection() {
  const db = await connectToDb(); // Connect to the database
  const taskAssignmentsCollection = db.collection("task_assignments"); // Access or create the collection

  // Ensure indexes for `task_id` and `user_id` to optimize queries
  await taskAssignmentsCollection.createIndex({ task_id: 1 });
  await taskAssignmentsCollection.createIndex({ user_id: 1 });

  console.log("Task Assignments collection is set up."); // Log confirmation
}

// Function to assign a user to a task
async function assignUserToTask(taskId, userId) {
  const db = await connectToDb(); // Connect to the database
  const taskAssignmentsCollection = db.collection("task_assignments"); // Access the collection

  // Check if the assignment already exists to avoid duplicate entries
  const existingAssignment = await taskAssignmentsCollection.findOne({
    task_id: taskId,
    user_id: userId,
  });

  if (existingAssignment) {
    console.log(`User ${userId} is already assigned to task ${taskId}.`);
    return existingAssignment._id; // Return the existing assignment's ID
  }

  // Insert a new task assignment
  const result = await taskAssignmentsCollection.insertOne({
    task_id: taskId, // Reference to the related task
    user_id: userId, // Reference to the assigned user
    assigned_at: new Date(), // Timestamp for when the assignment was made
  });

  console.log("User assigned to task successfully:", result.insertedId); // Log the ID of the new assignment
  return result.insertedId; // Return the inserted assignment's ID
}

// Function to retrieve assignments for a specific task
async function getAssignmentsByTask(taskId) {
  const db = await connectToDb(); // Connect to the database
  const taskAssignmentsCollection = db.collection("task_assignments"); // Access the collection

  // Query to find all assignments for the specified task
  const assignments = await taskAssignmentsCollection
    .find({ task_id: taskId }) // Filter by `task_id`
    .toArray(); // Convert the result to an array

  return assignments; // Return the list of assignments
}

// Function to retrieve tasks assigned to a specific user
async function getTasksByUser(userId) {
  const db = await connectToDb(); // Connect to the database
  const taskAssignmentsCollection = db.collection("task_assignments"); // Access the collection

  // Query to find all tasks assigned to the specified user
  const tasks = await taskAssignmentsCollection
    .find({ user_id: userId }) // Filter by `user_id`
    .toArray(); // Convert the result to an array

  return tasks; // Return the list of tasks
}

module.exports = {
  createTaskAssignmentsCollection,
  assignUserToTask,
  getAssignmentsByTask,
  getTasksByUser,
};
