const { connectToDb } = require("./db");

// Function to create the 'tasks' collection and ensure indexes
async function createTasksCollection() {
  const db = await connectToDb();
  const tasksCollection = db.collection("tasks");

  // Ensure indexes for assignee_id and project_id for faster lookups
  await tasksCollection.createIndex({ assignee_id: 1 });
  await tasksCollection.createIndex({ project_id: 1 });

  console.log("Tasks collection is set up.");
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
  const db = await connectToDb();
  const tasksCollection = db.collection("tasks");

  // Insert task document into the 'tasks' collection
  const result = await tasksCollection.insertOne({
    title,
    assignee_id: assigneeId || null, // Reference to the user assigned to the task (optional)
    due_date: dueDate ? new Date(dueDate) : null, // Convert due date to a Date object
    project_id: projectId || null, // Reference to the associated project (optional)
    dependencies: dependencies || null, // Dependencies as a string or array
    description: description || null, // Description of the task
    created_at: new Date(), // Automatically set the current timestamp
    updated_at: new Date(), // Automatically set the current timestamp
  });

  console.log("Task added successfully:", result.insertedId);
  return result.insertedId;
}

// Function to retrieve tasks by project
async function getTasksByProject(projectId) {
  const db = await connectToDb();
  const tasksCollection = db.collection("tasks");

  // Find tasks associated with a specific project
  const tasks = await tasksCollection.find({ project_id: projectId }).toArray();
  return tasks;
}

// Function to update a task
async function updateTask(taskId, updates) {
  const db = await connectToDb();
  const tasksCollection = db.collection("tasks");

  // Update task document with provided updates
  const result = await tasksCollection.updateOne(
    { _id: taskId },
    {
      $set: {
        ...updates,
        updated_at: new Date(), // Automatically update the timestamp
      },
    }
  );

  console.log(
    `Task with ID ${taskId} updated. Modified count:`,
    result.modifiedCount
  );
  return result.modifiedCount;
}

module.exports = {
  createTasksCollection,
  addTask,
  getTasksByProject,
  updateTask,
};
