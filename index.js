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
function concatAudio(){

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
//88
concatAudio();
// downloading SHORT tracks
//11
var link1 =
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a";
var link2 =
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview113/v4/e3/36/16/e33616f2-ce4a-2daf-2672-257f03f01b93/mzaf_2704479078257524742.plus.aac.p.m4a";
var fName1 = "f1.m4a";
var fName2 = "f2.m4a";

// download(link1, fName1);

function download(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https
      .get(url, function(response) {
        response.pipe(file);
        file.on("finish", function() {
          file.close(cb); // close() is async, call cb after close completes.
        });
      })
      .on("error", function(err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
      });
  };
  
//11

var where = "https://www.shazam.com/charts/top-200/ukraine";
var who = "div.title";
var what = "div.artist";
var number = "span.number";
var tr = "ul.tracks li[itemprop='track']";
var what2 = ".tracks";
var model = {};
var item = {};
var items = {};
var tracks = [];
var i = 0;
var temp = "";
var good50 = [];

async function getText(a, b) {
  let elements = await driver.findElements(By.css(a));
  if (Array.isArray(b)) {
    for (let e of elements) {
      b.push(await e.getText());
    }
    // console.log(temp)
    b.forEach(element => {
      i += 1;
      item["it" + i] = { song: element };
      items["it" + i] = item["it" + i];
    });
    console.log(items);
  } else {
    console.error("second argument is not an array");
  }
}

function getClear50() {
  let elements = driver.findElements(By.css(tr));
  for (let e of elements) {
    e.getAttribute("class").then(text => (temp = text));
    if (temp == "last-visible") break;
    good50.push(e);
    // tracks.push(await e.getText());
  }
}

(async function example() {
  try {
    await driver.get(where);
    await driver.wait(until.elementLocated(By.css(what)));
    // getClear50();

    // await getText(who,tracks);
    // tracks.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
    // console.log(items)
    // console.log(JSON.stringify(items));
    // fs.writeFile("new.txt",tracks,(err)=> {if (err) throw err; console.log('file is ok')})
    // fs.writeFile("artists.txt",JSON.parse(items),(err)=> {if (err) throw err; console.log('file is ok')})
  } finally {
    await driver.quit();
  }
})();




/* to do  
0. rename variables
1. album "image album-art flex-reset  img-audio-play" in style='background-image: url("https://images.shazam.com/coverart/t466040067-b1475546088_s400.jpg");'
2. short sound <meta itemprop="audio" content="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a">*/
