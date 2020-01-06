const {Builder, By, until} = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();
const audioconcat = require('audioconcat');
const fs = require('fs');

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
var temp='';
var good50 = [];

async function getText(a,b){
    let elements = await driver.findElements(By.css(a));
    if (Array.isArray(b)){
        for(let e of elements) {
            
            b.push(await e.getText());
        }
        // console.log(temp)
        b.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
        console.log(items)
    }else{
        console.error("second argument is not an array")
    }
}

function getClear50(){
    let elements = driver.findElements(By.css(tr));
        for(let e of elements) {
            e.getAttribute('class').then(text => temp = text)
            if (temp == 'last-visible') break;
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
    }
    finally {
        await driver.quit();
    }
})();

 // ********************* concat audio
// var songs = [
//   'beatles.mp3',
//   'greenday.mp3',
//   'u2.mp3'
// ]
 
// audioconcat(songs)
//   .concat('all.mp3')
//   .on('start', function (command) {
//     console.log('ffmpeg process started:', command)
//   })
//   .on('error', function (err, stdout, stderr) {
//     console.error('Error:', err)
//     console.error('ffmpeg stderr:', stderr)
//   })
//   .on('end', function (output) {
//     console.error('Audio created in:', output)
//   })


//********************* download audio

const http = require('https');

var link = "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a"
var fName = 'f.m4a'
// const file = fs.createWriteStream("file.m4a");
// const request = http.get(", function(response) {
//   response.pipe(file);
// });

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close(cb);  // close() is async, call cb after close completes.
      });
    }).on('error', function(err) { // Handle errors
      fs.unlink(dest); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
  };

  download(link,fName)

/* to do  
0. rename variables
1. album "image album-art flex-reset  img-audio-play" in style='background-image: url("https://images.shazam.com/coverart/t466040067-b1475546088_s400.jpg");'
2. short sound <meta itemprop="audio" content="https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/22/e5/8e/22e58eeb-5916-c584-257c-735e1b4b0175/mzaf_17966999117302129087.plus.aac.p.m4a">*/