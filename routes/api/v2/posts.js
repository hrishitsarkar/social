const express = require('express');

const router = express.Router();

const postApiU = require('../../../controllers/api/v2/posts_api');

router.get('/',postApiU.index);


module.exports = router;