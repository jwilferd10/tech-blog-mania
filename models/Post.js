const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Post extends model {}

// Unlike our prior work this won't be containing an option to vote.
// Define the post id, title, content and user_id
Post.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }, 
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        /* 
        Using the references property, we establish the relationship between this post and the user by creating a reference to the User model,
        specifically to the id column that is defined by the key property, which is the primary key
        The user_id is conversely defined as the foreign key and will be the matching link.
        */
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;