const { Builder, By, Key, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
var where = "https://www.shazam.com/charts/top-200/ukraine";
var what = ".play:nth-child(1)";
var what2 = ".tracks";
var tracks = [];

driver.get(where);
driver
  .wait(until.elementLocated(By.css(what2)))
  .then(_ => driver.findElement(By.css(what2)).getAttribute("innerHTML"))
  .then(_ => {
    tracks.push(_);
    console.log(_);
  })
  .then(
    setTimeout(() => {
      console.log(tracks);
      driver.close();
      driver.quit();
    }, 5000)
  );
// driver.findElement(By.css(what2)).getAttribute("innerHTML").then(_ => {tracks = _; console.log(tarcks)});
