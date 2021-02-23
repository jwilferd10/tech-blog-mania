const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Comment, } = require('../../models');

// Note that the username attribute was nested in the user object, which designates the table where this attribute is coming from.

// Get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll ({
        attributes: ['id', 'title', 'post_content', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// requesting the same attributes, including the username which requires a reference to the User model using the include property.
router.get('/:id', (req, res) => {
    Post.findOne ({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

/* 
    Expects 
    {
        title: 'Example Title', 
        post_url: 'TextHere', 
        user_id: 1
    }
*/