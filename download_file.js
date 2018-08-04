var fs = require("fs")
var request = require("request")
var performDownload = function (tmpPath, link, serialCb) {
    console.log("========== performDownload ===== ", tmpPath, link)
    //var tmpPath = destPath
    var file = fs.createWriteStream(tmpPath);
    var download = request.get({
      url: link,
      timeout: 30000
    });
  
  
    var hasCallbacked = false;
    var callback = function (err) {
      //console.log("==Down load callback===", err)
      if (!hasCallbacked) {
        hasCallbacked = true;
        if (err) {
          fs.exists(tmpPath, function (exists) {
            fs.unlinkSync(tmpPath)
            // fs.unlink(tmpPath);
          });
        }
        serialCb(err);
      }
    }
  
    download.on("response", function (response) {
      if (response.statusCode !== 200) {
        return callback("Faile to download dapp " + link + " with err code: " + response.statusCode);
      }else {
          console.log("Got response")
          console.dir(response.req.path)
          console.log(response.headers['content-type'])
          //response.response
      }
    });
  
    download.on("error", function (err) {
      return callback("Failed to download dapp " + link + " with error: " + err.message);
    });
  
    download.pipe(file);
  
    file.on("finish", function () {
      console.log("====== Download finish ======")
      file.close(callback);
    });
  }

  performDownload("master.zip", "https://github.com/libp2p/specs/archive/master.zip", function(err){
    if (err){
        console.dir(err)
    }else {
        console.log("Download is success")
    }
  })