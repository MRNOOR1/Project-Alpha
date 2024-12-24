const { connectToDb } = require("./db");

// Function to create the 'activity_logs' collection and ensure indexes
async function createActivityLogsCollection() {
  const db = await connectToDb();
  const activityLogsCollection = db.collection("activity_logs");

  // Ensure indexes for task_id and changed_by fields
  await activityLogsCollection.createIndex({ task_id: 1 });
  await activityLogsCollection.createIndex({ changed_by: 1 });

  console.log("Activity logs collection is set up.");
}

// Function to add an activity log
async function addActivityLog(taskId, field, oldValue, newValue, changedBy) {
  const db = await connectToDb();
  const activityLogsCollection = db.collection("activity_logs");

  // Insert an activity log into the 'activity_logs' collection
  const result = await activityLogsCollection.insertOne({
    task_id: taskId, // Reference to the task
    field, // The field that was changed
    old_value: oldValue, // The old value of the field
    new_value: newValue, // The new value of the field
    changed_by: changedBy, // Reference to the user who made the change
    timestamp: new Date(), // Automatically set the current timestamp
  });

  console.log("Activity log added successfully:", result.insertedId);
  return result.insertedId;
}

// Function to retrieve activity logs for a specific task
async function getActivityLogsByTask(taskId) {
  const db = await connectToDb();
  const activityLogsCollection = db.collection("activity_logs");

  // Find activity logs associated with a specific task
  const logs = await activityLogsCollection.find({ task_id: taskId }).toArray();
  return logs;
}

// Function to retrieve activity logs made by a specific user
async function getActivityLogsByUser(userId) {
  const db = await connectToDb();
  const activityLogsCollection = db.collection("activity_logs");

  // Find activity logs associated with a specific user
  const logs = await activityLogsCollection
    .find({ changed_by: userId })
    .toArray();
  return logs;
}

module.exports = {
  createActivityLogsCollection,
  addActivityLog,
  getActivityLogsByTask,
  getActivityLogsByUser,
};
