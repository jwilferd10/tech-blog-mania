/*
Saving the longest for last for the models.
All this file is responsible for is importing and exporting an object with it as a property
*/

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Set up associations

//=======USER=======//

// User can have many posts
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// User has many Comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

//=======COMMENT=======//

// Comments belong to specific Post
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

//=======POST=======//

// Post belongs to this User
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

// Post has many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Comment };