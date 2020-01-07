const { Builder, By, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

const fs = require("fs");
const http = require("http");
const https = require("https");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = "./files";

var fileList = [];
var listFileName = "list.txt";
var fileNames = "";

// reading and writing track list to file
//88
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
    .inputOptions(["-f concat", "-safe 0"])
    .outputOptions("-c copy")
    .save("./readyToUpload/mergedAudio.m4a")
    .on("error", function(err) {
      console.log("Error " + err.message);
    })
    .on("end", function() {
      console.log("Finished!");
    });
}

concatAudio();

// (async function example() {
//   try {
//     // await driver.get(where);
//     // await driver.wait(until.elementLocated(By.css(what)));
//     // await getClear50();
//     // await sortCreate();
//     // await removeFromFile.then(res => cyclicDownload()).catch(err => console.log(err));
//     // await concatAudio();
//     // await fs.writeFile("new.txt",tracks,(err)=> {if (err) throw err; console.log('file is ok')})
//     // await getText(who,tracks);
//     // await getText(what,tracks);
//     // await getText(who,tracks);
//     // tracks.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
//     // console.log(items)
//     // console.log(JSON.stringify(items));
//     // fs.writeFile("artists.txt",JSON.parse(items),(err)=> {if (err) throw err; console.log('file is ok')})
//   } finally {
//     await driver.quit();
//   }
// })();

/* to do  
0. rename variables
1. album "image album-art flex-reset  img-audio-play" in style='background-image: url("https://images.shazam.com/coverart/t466040067-b1475546088_s400.jpg");'
2. short sound <meta itemprop="audio" content="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a">*/
