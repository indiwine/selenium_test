const { Builder, By, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

const fs = require("fs");
const http = require("http");
const https = require("https");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = "./files";
var ghj=0;
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
    .inputOptions(["-f concat", "-safe 0", "-report"])
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
// downloading SHORT tracks
//11
var removeFromFile = new Promise(function(resolve, reject) {
  fs.readdir(dir, (err, files) => {
    try {
      if (files.length != 0) {
        files.forEach(file => {
          fs.unlinkSync(dir + "/" + file);
        });
        resolve("all files deleted");
      } else {
        resolve("there is no files");
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
});

function download(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https
    .get(url, function(response) {
      response.pipe(file);
      file.on("finish", function() {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on('close', function(){
        ghj=ghj+1;
        // console.log('file downloaded');
        console.log(ghj);
    })
    .on("error", function(err) {
      // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
}

//11

var where = "https://www.shazam.com/charts/top-200/ukraine";
var what = "div.artist";
var tr = "ul.tracks li[itemprop='track']";
var tracks = [];
var urlSh = [];
var urlShMusExt = [];
var urlShortMusic = [];
var urlImg = [];
var temp = "";
var temp2 = "";

// async function getText(a, b) {
//   let elements = await driver.findElements(By.css(a));
//   var itemKey = "";
//   if (a == who) itemKey = "song";
//   //   if (a == who) itemKey= 'range'
//   //   if (a == who) itemKey= 'artist'
//   //   if (a == who) itemKey= 'img'
//   //   if (a == who) itemKey= 'shortMusicUrl'
//   //   if (a == who) itemKey= 'MusicUrl'
//   //   if (a == who) itemKey= 'ShazamUrl'
//   //   if (a == who) itemKey= 'AppleMusicUrl'
//   console.log(a);
//   if (Array.isArray(b)) {
//     for (let e of elements) {
//       b.push(await e.getText());
//     }
//     // console.log(b)
//     b.forEach(element => {
//       i += 1;
//       item["it" + i] = { [itemKey]: element };
//       // item.song = element;
//       items["it" + i] = item["it" + i];
//     });
//     console.log(items);
//   } else {
//     console.error("second argument is not an array");
//   }
// }

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

var ast1 = "";

var qsd = new Promise(function(resolve, reject) {
    var i = 0;
    var ast = "";
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
    if(ghj==50){
        resolve('ok')
    }  
})

function cyclicDownload() {
  var i = 0;
  var ast = "";
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
//   return ghj
}

// var tyu = new Promise(function(resolve, reject) {
  (async function example() {
    try {
      await driver.get(where);
      await driver.wait(until.elementLocated(By.css(what)));
      await getClear50();
      await sortCreate();
      await removeFromFile
        .then(res => {
          qsd;
          console.log(res);
        }).then(_ =>{if (_==ok){concatAudio()}})
        .catch(err => console.log(err));
    //   console.log(ghj);

    //   await concatAudio();
      // await fs.writeFile("new.txt",tracks,(err)=> {if (err) throw err; console.log('file is ok')})
      // tracks.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
      // console.log(JSON.stringify(items));
      // fs.writeFile("artists.txt",JSON.parse(items),(err)=> {if (err) throw err; console.log('file is ok')})
    } catch (err) {
      console.log(err);
    } finally {
      // concatAudio();
    //   resolve("ok");
      await driver.quit();
    }
  })();
// });



// function check(callback) {
//     // do a bunch of stuff
//     if (ghj==50) {
//         // call the callback to notify other code
//         callback();
//     }
// }

// tyu
//   .then(_ => {
//     concatAudio();
//     console.log(_);
//   })
//   .catch(err => console.log(err));

/* to do  
0. rename variables
1. album "image album-art flex-reset  img-audio-play" in style='background-image: url("https://images.shazam.com/coverart/t466040067-b1475546088_s400.jpg");'
2. short sound <meta itemprop="audio" content="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a">*/
