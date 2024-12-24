const { connectToDb } = require("./db");

// Function to create the 'comments' collection and ensure indexes
async function createCommentsCollection() {
  const db = await connectToDb();
  const commentsCollection = db.collection("comments");

  // Ensure indexes for task_id and user_id for efficient lookups
  await commentsCollection.createIndex({ task_id: 1 });
  await commentsCollection.createIndex({ user_id: 1 });

  console.log("Comments collection is set up.");
}

// Function to add a comment to a task
async function addComment(taskId, userId, commentText) {
  const db = await connectToDb();
  const commentsCollection = db.collection("comments");

  // Insert comment document into the 'comments' collection
  const result = await commentsCollection.insertOne({
    task_id: taskId, // Reference to the task
    user_id: userId, // Reference to the user
    comment: commentText, // The actual comment text
    created_at: new Date(), // Automatically set the current timestamp
  });

  console.log("Comment added successfully:", result.insertedId);
  return result.insertedId;
}

// Function to retrieve comments for a specific task
async function getCommentsByTask(taskId) {
  const db = await connectToDb();
  const commentsCollection = db.collection("comments");

  // Find comments associated with a specific task
  const comments = await commentsCollection.find({ task_id: taskId }).toArray();
  return comments;
}

// Function to retrieve comments made by a specific user
async function getCommentsByUser(userId) {
  const db = await connectToDb();
  const commentsCollection = db.collection("comments");

  // Find comments associated with a specific user
  const comments = await commentsCollection.find({ user_id: userId }).toArray();
  return comments;
}

module.exports = {
  createCommentsCollection,
  addComment,
  getCommentsByTask,
  getCommentsByUser,
};
