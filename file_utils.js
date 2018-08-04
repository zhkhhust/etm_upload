module.exports = {
	
	getFileMd5: function(file, cb){
	  var crypto = require('crypto');
	  var fs = require('fs');
	  var rs = fs.createReadStream(file);
	  var hash = crypto.createHash('md5');
	  rs.on('data', hash.update.bind(hash));
	  rs.on('end', function () {
	    cb(null, hash.digest('hex'))
	  });
	}

	decompressZip: function (zipFile, dappPath, serialCb) {
	  var tmpPath = zipFile
	  var DecompressZip = require('decompress-zip');
	  var unzipper = new DecompressZip(tmpPath)
	  unzipper.on("error", function (err) {
	    fs.exists(tmpPath, function (exists) {
	      fs.unlink(tmpPath);
	    });
	    rmdir(dappPath, function () { });
	    serialCb("Failed to decompress zip file: " + err);
	  });

	  unzipper.on("extract", function (log) {
	    library.logger.info(dappPath + " Finished extracting");
	    fs.exists(tmpPath, function (exists) {
	      fs.unlink(tmpPath);
	    });
	    serialCb(null);
	  });

	  unzipper.on("progress", function (fileIndex, fileCount) {
	    library.logger.info(dappPath + " Extracted file " + (fileIndex + 1) + " of " + fileCount);
	  });

	  unzipper.extract({
	    path: dappPath,
	    strip: 1
	  });
	}

	downloadFile : function (destPath, link, serialCb) {
	  console.log("========== performDownload ===== ", destPath, link)
	  var tmpPath = destPath
	  var file = fs.createWriteStream(tmpPath);
	  var download = request.get({
	    url: link,
	    timeout: 30000
	  });

	  var hasCallbacked = false;
	  var callback = function (err) {
	    console.log("==Down load callback===", err)
	    if (!hasCallbacked) {
	      hasCallbacked = true;
	      if (err) {
	        fs.exists(tmpPath, function (exists) {
	          fs.unlink(tmpPath);
	        });
	      }
	      serialCb(err);
	    }
	  }

	  download.on("response", function (response) {
	    if (response.statusCode !== 200) {
	      return callback("Faile to download dapp " + link + " with err code: " + response.statusCode);
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
};
