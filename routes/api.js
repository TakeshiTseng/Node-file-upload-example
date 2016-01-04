var express = require('express');
var router = express.Router();

/*
 * api location start at /api
 */
router.get('/', function(req, res, next) {
    // rendering api document
});

route.get('/files/:fid', function(req, res, next) {
    // list all files
    // if fid is not undefined, download it.
});

route.post('/upload', function(req, res, next) {
    // upload a file
});

route.delete('files/:fid', function(req, res, next) {
    // delete file
});

module.exports = router;
