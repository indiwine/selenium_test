const AudioTrack = require('../audio/audio-track')
const {By} = require('selenium-webdriver')

class ShazamTrackBuilder {
  /**
   * @param {WebElement} node Track element to represent
   * @param {ShazamGrabCommand} command instance of a command class
   */
  constructor(node, command) {
    this.node = node
    this.command = command
    this.track = new AudioTrack()
  }

  /**
   * @return {Promise<AudioTrack|boolean>}
   */
  async build() {
    await Promise.all([
      this._fetchTitle(),
      this._fetchArtist(),
      this._fetchUrl(),
      this._fetchAudioUrl(),
      this._fetchThumbnail(),
    ])

    if (!this.track.audioUrl) {
      this.command.warn('\nCannot find suitable link for audio. Skipping')
      this.command.warn(this.track)
      return false
    }

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
