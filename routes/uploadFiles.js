var express = require('express');
var router = express.Router({ mergeParams: true });
var fs = require('fs');

/**
 * @api {post} /users/:IdUser/logs/ Create Connection Logs information
 * @apiVersion 1.1.0
 * @apiName PostConnectionLogs
 * @apiGroup LogsConnection
 *
 * @apiParam {Number} IdUser  Unique id of the user related to this log.
 * @apiParam {Date} Date  Date when the log was saved.
 * @apiParam {String} Description  Description of the log.
 * 
 * @apiSuccess {String} message  LogsConnection created.
 *
 * @apiError ConnectionNotCreated The log was not created.
 */
router.post('/', function(req, res) 
{
  var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
      fstream = fs.createWriteStream(process.cwd() + '/uploads/' + filename);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.status(200).json({
          message: "File uploaded"
        });
      });
  });
});

module.exports = router;