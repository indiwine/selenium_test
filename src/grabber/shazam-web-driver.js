const {Builder, By, until} = require('selenium-webdriver')
const {cli} = require('cli-ux')
const trackPool = require('../audio/track-pool')
const ShazamTrackBuilder = require('./shazam-track-builder')

const BASE_URL = 'https://www.shazam.com/charts/top-200/'

class ShazamWebDriver {
  /**
   * @param {string} country name of the country to fetch tracks from
   * @param {number} numberOfSongs number of tracks to fetch
   * @param {ShazamGrabCommand} command instance of a command class
   */
  constructor(country, numberOfSongs, command) {
    this.numberOfSongs = numberOfSongs
    this.command = command
    this.url = BASE_URL + country.toLowerCase()
    this.tracks = trackPool
  }

  async fetch() {
    try {
      cli.action.start('Fetching web page')
      /**
       * @type {IWebDriver}
       */
      this.driver = new Builder().forBrowser('chrome').build()

      await this.driver.get(this.url)
      await this.driver.wait(until.elementLocated(By.css('.charttracks > .shz-partial-showmoreless')))
      await this.driver.sleep(1500)

      let btn = await this.driver.findElement(By.css('.charttracks [data-shz-beacon-id="global.buttons.ue-btn-showmore"]'))
      await this.driver.executeScript('arguments[0].scrollIntoView()', btn)
      await btn.click()
      await this.driver.sleep(500)
      const trackNodes = await this.driver.findElements(By.css('.charttracks > .tracks > li'))
      cli.action.stop()

      const progressBar = cli.progress({
        format: 'Processing tracks | {bar} | {value}/{total} Tracks',
      })

      progressBar.start(this.numberOfSongs)

      let promises = []

      let i = 1
      for (let node of trackNodes) {
        promises.push(this._parseTrack(node, i, p => progressBar.update(p)))
        i++
        if (i > this.numberOfSongs) {
          break
        }
      }

      await Promise.all(promises)
      progressBar.stop()

    } catch (error) {
      this.command.error(error)
    } finally {
      cli.action.stop()
      await this.driver.quit()
    }

  }

  /**
   * @param {WebElement} node li element of a track
   * @param {number} position tracks position
   * @param {function} done called when track processing is finished
   * @return {Promise<void>}
   * @private
   */
  async _parseTrack(node, position, done) {
    const builder = new ShazamTrackBuilder(node, this.command)
    const trackInst = await builder.build()
    if (trackInst) {
      trackInst.position = position
      this.tracks.add(trackInst)
    }
    done(position)
  }
}

module.exports = ShazamWebDriver
