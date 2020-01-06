const {Builder, By, until} = require('selenium-webdriver');
const driver = new Builder().forBrowser('chrome').build();
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
    let elements = await driver.findElements(By.css(tr));
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
        getClear50();

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