var express = require('express');
var app = express();
var fs = require("fs");
 
var bodyParser = require('body-parser');
var multer  = require('multer');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, './uploads/');
    },
    filename: function (req, file, cb){
      //file.originalname上传文件的原始文件名
      var changedName = (new Date().getTime())+'-'+file.originalname;
      cb(null, changedName);
    }
  })
});


app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})
 
app.post('/file_upload', upload.single('file'),(req,res)=>{
  console.log(req.file);
  res.json({
    code: '0000',
    type:'single',
    originalname: req.file.originalname
  })
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})
