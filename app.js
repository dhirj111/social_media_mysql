const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const router = express.Router();

const sequelize = require('./util/database');
const app = express();


const Post = require('./models/post');
const Comment = require('./models/comment')
// Model Definitions


// Associations
Comment.belongsTo(Post, { foreignKey: 'postId' });
Post.hasMany(Comment, { foreignKey: 'postId' });

// Middleware and Configuration
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', 'views');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const postRoute = require('./routes/post');
app.use(postRoute);

// Sync database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(7000, () => {
      console.log('Server is running on http://localhost:7000');
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });