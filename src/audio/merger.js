const {cli} = require('cli-ux')
const ffmpeg = require('fluent-ffmpeg')
const tempy = require('tempy')
const fs = require('fs')

class Merger {
  /**
   * @param {TrackPool} pool
   * @param {string} targetFile
   * @param {ShazamGrabCommand} command instance of a command class
   */
  constructor(pool, targetFile, command) {
    this.pool = pool
    this.targetFile = targetFile
    this.command = command

    this._exportListPath = null
  }

  async merge() {
    try {
      await this._downloadAudio()
      this._generateExportList()
      cli.action.start('Merging audio')
      await this._doMerge()
    } catch (error) {
      this.command.error(error)
    } finally {
      cli.action.stop()
      this.pool.cleanUp()
      this._cleanUp()
    }
  }

  async _downloadAudio() {
    const progressBar = cli.progress({
      format: 'Downloading files | {bar} | {value}/{total} Tracks | Current: {current}',
    })

    progressBar.start(this.pool.storage.size, 0, {
      current: 'N/A',
    })

    let i = 1
    for (let track of this.pool.storage) {
      progressBar.update(i, {
        current: track.toString(),
      })

      // eslint-disable-next-line no-await-in-loop
      await track.fetchAudio()
      i++
    }

    progressBar.stop()
  }

  _doMerge() {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
      command.input(this._exportListPath)
      .inputOptions(['-f concat', '-safe 0', '-report'])
      .outputOptions('-c copy')
      .save(this.targetFile)
      .on('error', err => {
        reject(err)
      })
      .on('end', function () {
        resolve()
      })
    })
  }

  _generateExportList() {
    this._exportListPath = tempy.file({extension: 'txt'})
    const stream = fs.createWriteStream(this._exportListPath)

    for (let track of this.pool.storage) {
      stream.write(`file '${track.tmpFilePath}'\n`)
    }

    stream.close()
  }

  _cleanUp() {
    if (this._exportListPath && fs.existsSync(this._exportListPath)) {
      fs.unlinkSync(this._exportListPath)
    }
  }
}

module.exports = Merger
