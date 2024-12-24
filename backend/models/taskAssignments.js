const { connectToDb } = require("./db");

// Function to create the 'task_assignments' collection and ensure indexes
async function createTaskAssignmentsCollection() {
  const db = await connectToDb();
  const taskAssignmentsCollection = db.collection("task_assignments");

  // Ensure indexes for task_id and user_id for efficient lookups
  await taskAssignmentsCollection.createIndex({ task_id: 1 });
  await taskAssignmentsCollection.createIndex({ user_id: 1 });

  console.log("Task Assignments collection is set up.");
}

// Function to assign a user to a task
async function assignUserToTask(taskId, userId) {
  const db = await connectToDb();
  const taskAssignmentsCollection = db.collection("task_assignments");

  // Insert task assignment document into the 'task_assignments' collection
  const result = await taskAssignmentsCollection.insertOne({
    task_id: taskId, // Reference to the task
    user_id: userId, // Reference to the user
    assigned_at: new Date(), // Automatically set the current timestamp
  });

  console.log("User assigned to task successfully:", result.insertedId);
  return result.insertedId;
}

// Function to retrieve assignments for a specific task
async function getAssignmentsByTask(taskId) {
  const db = await connectToDb();
  const taskAssignmentsCollection = db.collection("task_assignments");

  // Find assignments associated with a specific task
  const assignments = await taskAssignmentsCollection
    .find({ task_id: taskId })
    .toArray();
  return assignments;
}

// Function to retrieve tasks assigned to a specific user
async function getTasksByUser(userId) {
  const db = await connectToDb();
  const taskAssignmentsCollection = db.collection("task_assignments");

  // Find tasks assigned to a specific user
  const tasks = await taskAssignmentsCollection
    .find({ user_id: userId })
    .toArray();
  return tasks;
}

module.exports = {
  createTaskAssignmentsCollection,
  assignUserToTask,
  getAssignmentsByTask,
  getTasksByUser,
};
