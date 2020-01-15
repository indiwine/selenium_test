const AudioTrack = require('../audio/audio-track')
const {By} = require('selenium-webdriver')

class ShazamTrackBuilder {
  /**
   * @param {WebElement} node Track element to represent
   */
  constructor(node) {
    this.node = node
    this.track = new AudioTrack()
  }

  /**
   * @return {Promise<AudioTrack>}
   */
  async build() {
    await Promise.all([
      this._fetchTitle(),
      this._fetchArtist(),
      this._fetchUrl(),
      this._fetchAudioUrl(),
      this._fetchThumbnail(),
    ])

    return this.track
  }

  async _fetchTitle() {
    const titleElement = await this.node.findElement(By.css(' .details > .title'))
    this.track.title = await titleElement.getText()
  }

  async _fetchArtist() {
    const artistElement = await this.node.findElement(By.css(' .details > .artist'))
    this.track.artist = await artistElement.getText()
  }

  async _fetchUrl() {
    const node = await this.node.findElement(By.css('meta[itemprop="url"]'))
    this.track.url = await node.getAttribute('content')
  }


  async _fetchAudioUrl() {
    const node = await this.node.findElement(By.css('meta[itemprop="audio"]'))
    this.track.audioUrl = await node.getAttribute('content')
  }

  async _fetchThumbnail() {
    const node = await this.node.findElement(By.css('.image'))
    const urlProp = await this.node.getDriver()
    .executeScript('return window.document.defaultView.getComputedStyle(arguments[0]).getPropertyValue(\'background-image\')', node)

    const regex = /^url\("([\S]+)"\)$/
    const result = regex.exec(urlProp)
    if (result) {
      this.track.thumbnailUrl = result[1]
    }
  }

}

module.exports = ShazamTrackBuilder
