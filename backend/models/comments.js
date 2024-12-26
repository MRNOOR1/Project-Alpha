/**
 * MongoDB Comments Collection Setup
 *
 * This script manages the `comments` collection in MongoDB, which stores comments related to tasks.
 *
 * - `createCommentsCollection`: Sets up the `comments` collection and ensures indexes for efficient querying.
 * - `addComment`: Adds a new comment to a specific task.
 * - `getCommentsByTask`: Retrieves all comments associated with a specific task.
 * - `getCommentsByUser`: Retrieves all comments made by a specific user.
 *
 * Notes:
 * - Indexes on `task_id` and `user_id` enhance performance for queries filtering by task or user.
 * - Each comment document includes a `created_at` timestamp to record when the comment was made.
 */

const { connectToDb } = require("./db");

// Function to create the 'comments' collection and ensure indexes
async function createCommentsCollection() {
  const db = await connectToDb(); // Connect to the database
  const commentsCollection = db.collection("comments"); // Access or create the 'comments' collection

  // Ensure indexes for `task_id` and `user_id` to optimize queries
  await commentsCollection.createIndex({ task_id: 1 });
  await commentsCollection.createIndex({ user_id: 1 });

  console.log("Comments collection is set up."); // Log confirmation
}

// Function to add a comment to a task
async function addComment(taskId, userId, commentText) {
  const db = await connectToDb(); // Connect to the database
  const commentsCollection = db.collection("comments"); // Access the 'comments' collection

  // Insert a new comment document into the collection
  const result = await commentsCollection.insertOne({
    task_id: taskId, // Reference to the related task
    user_id: userId, // Reference to the user who made the comment
    comment: commentText, // The actual text of the comment
    created_at: new Date(), // Timestamp when the comment was created
  });

  console.log("Comment added successfully:", result.insertedId); // Log the ID of the added comment
  return result.insertedId; // Return the inserted comment's ID
}

// Function to retrieve comments for a specific task
async function getCommentsByTask(taskId) {
  const db = await connectToDb(); // Connect to the database
  const commentsCollection = db.collection("comments"); // Access the 'comments' collection

  // Query to find all comments associated with the specified task
  const comments = await commentsCollection
    .find({ task_id: taskId }) // Filter comments by `task_id` field
    .toArray(); // Convert the result to an array

  return comments; // Return the array of comments
}

// Function to retrieve comments made by a specific user
async function getCommentsByUser(userId) {
  const db = await connectToDb(); // Connect to the database
  const commentsCollection = db.collection("comments"); // Access the 'comments' collection

  // Query to find all comments associated with the specified user
  const comments = await commentsCollection
    .find({ user_id: userId }) // Filter comments by `user_id` field
    .toArray(); // Convert the result to an array

  return comments; // Return the array of comments
}

module.exports = {
  createCommentsCollection,
  addComment,
  getCommentsByTask,
  getCommentsByUser,
};
