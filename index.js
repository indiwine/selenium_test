const {Builder, By, until} = require('selenium-webdriver');
const fs = require('fs');

var where = "https://www.shazam.com/charts/top-200/ukraine";
var who = "div.title";
var what = "div.artist";
var number = "span.number";
var item = "li[itemprop='track']";
var what2 = ".tracks";
var tracks = [];

(async function example() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(where);
        await driver.wait(until.elementLocated(By.css(what)));
        let elements = await driver.findElements(By.css(item));
        for(let e of elements) {
            console.log(await e.getText());
            tracks.push(await e.getText());
        }
        fs.writeFile("new.txt",tracks,(err)=> {if (err) throw err; console.log('file is ok')})
    }
    finally {
        await driver.quit();
    }
})();