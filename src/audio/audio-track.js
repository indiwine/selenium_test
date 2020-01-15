const https = require('https')
const fs = require('fs')
const tempy = require('tempy')
const path = require('path')

class AudioTrack {
  constructor() {
    this.artist = 'Unknown Artist'
    this.title = 'Unknown Track'
    this.url = ''
    this.audioUrl = ''
    this.thumbnailUrl = ''
    this.position = null

    this._tmpFilePath = null
  }

  get tmpFilePath() {
    if (this._tmpFilePath === null) {
      throw new Error('File was not fetched yet')
    }

    return this._tmpFilePath
  }

  fetchAudio() {
    return new Promise((resolve, reject) => {
      this._tmpFilePath = tempy.file({
        extension: path.extname(this.audioUrl),
      })

      let file = fs.createWriteStream(this._tmpFilePath)

      https.get(this.audioUrl, response => {
        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })
      }).on('error', err => {
        reject(err)
      })

    })
  }


  cleanUp() {
    if (fs.existsSync(this._tmpFilePath)) {
      fs.unlinkSync(this._tmpFilePath)
    }
  }
}

module.exports = AudioTrack
