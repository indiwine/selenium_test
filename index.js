const { Builder, By, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

const fs = require("fs");
const http = require("http");
const https = require("https");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = "./files";
const dir2 = "./readyToUpload";
const dir3 = "./img";
var ghj = 0;
var fileList = [];
var listFileName = "list.txt";
var fileNames = "";

var where = "https://www.shazam.com/charts/top-200/russia";
var what = "div.artist";
var tr = "ul.tracks li[itemprop='track']";
var tracks = [];
var urlSh = [];
var urlShMusExt = [];
var urlShortMusic = [];
var urlImg = [];
var temp = "";
var temp2 = "";

function checkDir(d){
  if (!fs.existsSync(d)){
    fs.mkdirSync(d);
  }
}

checkDir(dir);
checkDir(dir2);
checkDir(dir3);


// // reading and writing track list to file
// //88
// function concatAudio() {
//   fs.readdir(dir, (err, files) => {
//     files.forEach(file => {
//       fileList.push(file);
//     });
//     console.log(fileList);
//     fileList.forEach(fileName => {
//       fileNames = fileNames + "file '" + dir + "/" + fileName + "'\n";
//     });
//     console.log(fileNames);
//     fs.writeFileSync(listFileName, fileNames);
//   });

//   merge
//     .input(listFileName)
//     .inputOptions(["-f concat", "-safe 0", "-report"])
//     .outputOptions("-c copy")
//     .save("./readyToUpload/mergedAudio.m4a")
//     .on("error", function(err) {
//       console.log("Error " + err.message);
//     })
//     .on("end", function() {
//       console.log("Finished!");
//     });
// }
// //88
// // downloading SHORT tracks


function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https
    .get(url, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("close", function() {
      ghj = ghj + 1;
      // console.log('file downloaded');
      console.log(ghj);
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
}

async function getClear50() {
  let elements = await driver.findElements(By.css(tr));
  for (let e of elements) {
    await e.getAttribute("class").then(text => (temp = text));
    await e.getAttribute("innerHTML").then(text2 => (temp2 = text2));
    var q = temp2.substring(temp2.indexOf('itemprop="url" content="'));
    var z = q.substring(
      q.indexOf("http"),
      q.indexOf('"><meta itemprop="audio" content="')
    );
    var t = q.substring(
      q.indexOf('"><meta itemprop="audio" content="') +
        '"><meta itemprop="audio" content="'.length,
      q.indexOf('"><div class="grid')
    );

    var y = t.substring(t.lastIndexOf("."));
    // console.log("!!!!!!!!!!!! " + y);

    var w = q.substring(
      q.indexOf('style="background-image: url(&quot;') +
        'style="background-image: url(&quot;'.length,
      q.indexOf('&quot;);"> <ul class="')
    );
    // console.log("!!!!!!!!!!!! " + w.substring(0, 60));

    urlSh.push(z);
    urlShMusExt.push(y);
    urlShortMusic.push(t);
    urlImg.push(w);
    if (temp == "hide") break;
    // await good50.push(e);
    tracks.push(await e.getText());
  }
  //   console.log(urls);
}

var ar1 = [],
  ar2 = [],
  ar3 = [];
ar4 = {};

async function sortCreate() {
  tracks.forEach(el => {
    ar1.push(el.split("\n"));
  });
  // console.log(ar1)
  ar1.reduce(function(result, item, index, array) {
    var result1 = {};
    for (var i = 0; i < item.length; i++) {
      result1.chNum = item[0];
      result1.trackName = item[1];
      result1.artist = item[2];
      result1.urlImg = urlImg[index];
      result1.urlSh = urlSh[index];
      result1.urlShortMusic = urlShortMusic[index];
      result1.urlShMusExt = urlShMusExt[index];
      result["it" + (index + 1)] = result1;
    }
    return result;
  }, ar4);
  // console.log(ar4);
}

function cyclicDownload() {
  var i = 0;
  var ast = "";

  fs.readdir(dir, (err, files) => {
      if (files.length != 0) {
        files.forEach(file => {
          fs.unlinkSync(dir + "/" + file);
        });
      }
    }
  )


  for (e in ar4) {
    i = i + 1;
    if (i < 10) {
      ast = "0" + i;
    }
    if (i >= 10) {
      ast = i;
    }
    download(ar4[e].urlShortMusic, dir + "/" + ast + ar4[e].urlShMusExt);
  }
}

(async function example() {
  try {
    await driver.get(where);
    await driver.wait(until.elementLocated(By.css(what)));
    await getClear50();
    await sortCreate();
    await cyclicDownload();
    // await concatAudio();
    await fs.writeFile("new.txt",tracks,(err)=> {if (err) throw err; console.log('file is ok')})
    // tracks.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
    // console.log(JSON.stringify(items));
    // fs.writeFile("artists.txt",JSON.parse(items),(err)=> {if (err) throw err; console.log('file is ok')})
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
  }
})();
