// Starting off the route-work with users!
const router = require('express').Router();
const { User, Post, Comment, } = require('../../models');

// Find all users 
router.get('/', (req, res) => {
    User.findAll ({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})

// Find single user
router.get('/:id', (req, res) => {
    User.findOne ({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }            
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

/* 
Expects something like
    {
     username: 'ExampleName', 
     email: 'example@gmail.com', 
     password: 'password1234'
    }
*/
router.post('/', (req, res) => {
    User.create ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    // Sessions setup, going to request user id, name and if logged in has been switched to true
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//***LOGIN AND LOGOUT START***//

// This route will be found at http://localhost:3001/api/users/login in the browser.
router.post('/login', (req, res) => {
    User.findOne ({
        where: {
            email: req.body.email
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
    
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        // Regular sessions setup, however notify when successfully logged in
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'Success, you are now logged in!' });
        });
    });
});

// If we gotta workout on a timeout, I bet something will have to be changed here
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

//***LOGIN AND LOGOUT END***//

