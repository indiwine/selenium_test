const {cli} = require('cli-ux')

class TrackPool {
  constructor() {
    /**
     * @type {Set<AudioTrack>}
     */
    this.storage = new Set()
  }

  /**
   * @param {AudioTrack} track
   */
  add(track) {
    this.storage.add(track)
  }


  cleanUp() {
    cli.action.start('Cleaning temporary files')

    for (let track of this.storage) {
      track.cleanUp()
    }

    cli.action.stop()
  }

}

module.exports = new TrackPool()
