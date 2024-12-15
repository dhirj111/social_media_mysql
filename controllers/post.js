const path = require('path');
const Post = require('../models/post');
const Comment = require('../models/comment');

exports.serveindex = ('/', (req, res, next) => {
  res.sendFile(path.join(__dirname,'..', 'views', 'index.html'));
});

exports.newpost = async (req, res, next) => {
  try {
    const { imageLink, imageCaption } = req.body;

    // Validate input
    if (!imageLink) {
      return res.status(400).json({ error: 'Image link is required' });
    }

    // Create post
    const newPost = await Post.create({
      imagelink: imageLink,
      postcaption: imageCaption || ''
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: {
        id: newPost.id,
        imagelink: newPost.imagelink,
        postcaption: newPost.postcaption
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
}

// Middleware to get all posts with their comments
exports.getpostcomments = async (req, res, next) => {
  try {
    console.log("in l41 posts getpostcomments")
    // Step 1: Fetch all posts from the database
    const posts = await Post.findAll();

    // Step 2: Fetch all comments from the database
    const comments = await Comment.findAll();

    // Step 3: Initialize an array to store the formatted posts with their comments
    const formattedPosts = [];

    // Step 4: Loop through each post to format the data
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]; // Current post
      const postComments = []; // Array to hold comments for this post

      // Step 5: Find and collect comments related to the current post
      for (let j = 0; j < comments.length; j++) {
        const comment = comments[j];
        if (comment.postId === post.id) { // Match comments with the post by `postId`
          postComments.push({
            text: comment.comment, // Comment text
            username: comment.username, // Username of the commenter
          });
        }
      }

      // Step 6: Add the post and its associated comments to the formatted posts array
      formattedPosts.push({
        id: post.id, // Post ID
        imageLink: post.imagelink, // Link to the image
        imageCaption: post.postcaption, // Caption for the image
        comments: postComments, // List of comments for this post
      });
    }

    // Step 7: Send the formatted posts as a JSON response
    res.json(formattedPosts);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

// Middleware to add a comment to a specific post

exports.addcommentonpost = async (req, res, next) => {
  try {
    const { postId, comment } = req.body;

    // Validate input
    if (!postId || !comment) {
      return res.status(400).json({ error: 'Post ID and comment are required' });
    }

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Create comment
    const newComment = await Comment.create({
      postId: postId,
      comment: comment,
      username: 'Anonymous'
    });

    res.status(201).json({
      message: 'Comment added successfully',
      comment: {
        id: newComment.id,
        text: newComment.comment,
        username: newComment.username
      }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
}