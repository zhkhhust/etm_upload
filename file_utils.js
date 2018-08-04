var fs = require('fs');
var request = require("request")
var crypto = require('crypto');
var DecompressZip = require('decompress-zip');

module.exports = {
	
	getFileMd5: function(file, cb){
	  
		
		var exists = fs.existsSync(file);
		if (!exists){
			return cb("File not exists", null);
		}
	  var rs = fs.createReadStream(file);
	  var hash = crypto.createHash('md5');
	  rs.on('data', hash.update.bind(hash));
	  rs.on('end', function () {
	    cb(null, hash.digest('hex'))
	  });
	},

	decompressZip: function (filename, destPath, cb) {

		var exists = fs.existsSync(filename);
		if (!exists){
			return cb("File not exists: " + filename);
		}
    var unzipper = new DecompressZip(filename)

    unzipper.on('error', function (err) {
        //console.log('Caught an error');
        cb(err)
    });
    
    unzipper.on('extract', function (log) {
        console.log('Finished extracting');
        cb(null)
    });
    
    unzipper.on('progress', function (fileIndex, fileCount) {
        //console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });
    
    unzipper.extract({
        path: 'some/path',
        filter: function (file) {
            return file.type !== "SymbolicLink";
        }
    });
  },

  listZip: function (filename, cb){
    var DecompressZip = require('decompress-zip');
    
    var unzipper = new DecompressZip(filename)
    
    unzipper.on('error', function (err) {
        cb(err, null)
    });
    
    unzipper.on('list', function (files) {
        //console.log('The archive contains:');
        //console.log(files);
        cb(null, files)
    });
    
    unzipper.list();
  },

	downloadFile : function (destPath, link, cb) {
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
	          fs.unlinkSync(tmpPath);
	        });
	      }
	      cb(err);
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
