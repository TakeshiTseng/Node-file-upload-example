'use strict';

/*
* API for file resources.
*/

var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer  = require('multer')
var uploadMiddleware = multer({ dest: 'tmp_files/' })
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');

/*
* api location start at /api
*/
router.get('/', function(req, res, next) {
  // rendering api document
  res.render('api_doc', { title: 'Express' });
});

router.get('/files', function(req, res, next) {
  // list all files
  let conn = req.app.get('db_conn');
  let gfs = Grid(conn.db, mongoose.mongo);
  gfs.files.find().toArray(function(err, files) {
    if(err) {
      res.status(500).json({msg: 'inter server error', err: true, result: []});
      res.end();
    } else {
      res.status(200).json({msg: 'ok', err: false, result: files});
      res.end();
    }
  });
});

router.delete('/files/:fid', function(req, res, next) {
  // delete file
  let conn = req.app.get('db_conn');
  let gfs = Grid(conn.db, mongoose.mongo);
  let fid = req.params.fid;
  gfs.remove({_id: fid}, function (err) {
    if (err) {
      res.status(500).json({msg: 'inter server error', err: true});
      res.end();
    } else {
      res.status(200).json({msg: 'ok', err: false});
      res.end();
    }
  });
});

router.get('/files/:fid', function(req, res, next) {
  if(req.params.fid === undefined) {
    res.status(400).json({msg: 'file ID not defined', err: true});
    res.end();
  } else {
    // if fid is not undefined, download it.
    let fid = req.params.fid;
    let conn = req.app.get('db_conn');
    let gfs = Grid(conn.db, mongoose.mongo);
    gfs.findOne({_id: fid}, function(err, file) {
      if(err) {
        res.status(500).json({msg: 'inter server error', err: true, result: []});
        res.end();
      } else if(!file){
        res.status(404).json({msg: 'file not found', err: true, result: []});
        res.end();
      } else {
        let filename = file.filename;
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
        res.set('Content-Length', file.chunkSize);

        let readstream = gfs.createReadStream({_id: fid});
        readstream.pipe(res);
      }
    });

  }
});

router.post('/upload', uploadMiddleware.single('file'), function(req, res, next) {
  // upload a file
  if(req.file === undefined) {
    // file empty
    res.status(400).json({msg: 'File is undefined.', err: true});
    res.end();
  } else {
    let filePath = req.file.path;
    let fileName = req.file.originalname;
    let conn = req.app.get('db_conn');
    let gfs = Grid(conn.db, mongoose.mongo);
    let writestream = gfs.createWriteStream({filename: fileName});
    fs.createReadStream(filePath).pipe(writestream);
    res.status(201).json({msg: 'file created', err: false});
  }
});



module.exports = router;
