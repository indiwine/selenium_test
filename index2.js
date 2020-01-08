
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = "./files";

var fileList = [];
var listFileName = "list.txt";
var fileNames = "";
var saveString = "./readyToUpload/mergedAudio.m4a";

function concatAudio() {
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      fileList.push(file);
    });
    console.log(fileList);
    fileList.forEach(fileName => {
      fileNames = fileNames + "file '" + dir + "/" + fileName + "'\n";
    });
    console.log(fileNames);
    fs.writeFileSync(listFileName, fileNames);
  });

  merge
    .input(listFileName)
    .inputOptions(["-f concat", "-safe 0","-report"])
    .outputOptions("-c copy")
    .save(saveString)
    .on("error", function(err) {
      console.log("Error " + err.message);
    })
    .on("end", function() {
      console.log("Finished!");
    });
}

concatAudio();
