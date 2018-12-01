var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var ctrlProfile = require('../controllers/profile');
var ctrlAuth = require('../controllers/authentication');
var taskCtrl = require('../controllers/taskController');
var userSearch = require('../controllers/searchUser.js');

// profile
router.get('/profile', auth, ctrlProfile.profileRead);

// authentication  
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/createTask',auth, taskCtrl.createTask);
router.post('/fetchTask',auth, taskCtrl.fetchTask);
router.post('/deleteTask',auth, taskCtrl.deleteTask);
router.post('/updateTask',auth, taskCtrl.updateTask);
router.post('/searchUser',auth, userSearch.searchUsers);
// router.post('/editTask', ctrlAuth.login);
// router.post('/deleteTask', ctrlAuth.login);

module.exports = router;
