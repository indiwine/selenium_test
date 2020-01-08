
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
// var dateFormat = require('dateformat');
// var asd = (new Date()).dateFormat(now, "mmmm yyyy");
var saveString = "./rtuv/shazam world top50 jan 2020.mp4";

function concatAudio() {
  // read(dir,fileList,fileNames,listFileName);
  // read(dir3,fileList2,fileNames2,listFileName2);

    merge
    .addInput('./img/1.jpg')
    .inputOption('-loop 1')
    .addInput('./readyToUpload/mergedAudio.m4a')
    .outputOption(["-c:v libx264","-c:a copy","-shortest"])
    .save(saveString)
    .on("error", function(err) {
      console.log("Error " + err.message);
    })
    .on("end", function() {
      console.log("Finished!");
    });
}

concatAudio();
