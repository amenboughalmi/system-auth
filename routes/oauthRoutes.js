const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const successController = require('../controllers/successController');

router.get('/google', oauthController.oauthGoogle);
router.get('/google/callback', oauthController.oauthGoogleCallback);
router.get('/success', successController.authSuccess);

module.exports=router