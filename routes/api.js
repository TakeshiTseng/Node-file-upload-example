var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer  = require('multer')
var uploadMiddleware = multer({ dest: 'tmp_files/' })
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var dbconfig = require(__dirname + '/../config.js');


/*
 * api location start at /api
 */
router.get('/', function(req, res, next) {
    // rendering api document
});

router.get('/files/:fid', function(req, res, next) {
    // list all files
    // if fid is not undefined, download it.
});

router.post('/upload', uploadMiddleware.single('file'), function(req, res, next) {
    // upload a file
    if(!req.file) {
        res.status(400).json({msg: 'File is undefined.', err: true});
        res.end();
    }
    var filePath = req.file.path;
    var fileName = req.file.filename;
    var conn = mongoose.createConnection(dbconfig.url);
    conn.once('open', function () {
        var gfs = Grid(conn.db, mongoose.mongo);
        var writestream = gfs.createWriteStream({filename: fileName});
        fs.createReadStream(filePath).pipe(writestream);
        conn.close();
        res.status(201).json({msg: 'done', err: false});
    });
});

router.delete('files/:fid', function(req, res, next) {
    // delete file
});

module.exports = router;
