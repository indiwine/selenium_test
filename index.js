const {Builder, By, Key, until} = require('selenium-webdriver');

var driver = new Builder().forBrowser('chrome').build();
var where = 'https://www.shazam.com/charts/top-200/ukraine';
var what = '.play:nth-child(1)';

try {
    driver.get(where)
        .then(_ => driver.wait(until.elementLocated(By.css(what))))
        .then(_ => driver.findElement(By.css(what)).click())
        .then(_ => driver.findElement(By.css(what)).click())
        .then(_ => setTimeout(() => {  driver.quit() }, 20000))
} catch (err){
    console.log(err)
}