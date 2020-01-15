const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const ShazamWebDriver = require('./grabber/shazam-web-driver')
const Merger = require('./audio/merger')

class ShazamGrabCommand extends Command {

  async run() {
    const {flags} = this.parse(ShazamGrabCommand)
    const {args} = this.parse(ShazamGrabCommand)


    const driver = new ShazamWebDriver(flags.country, flags.amount, this)
    await driver.fetch()

    const merger = new Merger(driver.tracks, args.file, this)
    await merger.merge()
  }
}

ShazamGrabCommand.args = [
  {
    name: 'file',
    required: false,
    description: 'output file',
    default: 'output.m4a',
  },
]

ShazamGrabCommand.description = 'Grab files from shazam'

ShazamGrabCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({char: 'v'}),
  // add --help flag to show CLI version
  help: flags.help({char: 'h'}),
  // name: flags.string({char: 'n', description: 'name to print'}),
  country: flags.string({char: 'c', description: 'country name to fetch list for', default: 'world'}),
  amount: flags.string({
    char: 'n',
    description: 'amount of tracks to fetch',
    default: 200,
    parse: input => {
      const result = parseInt(input, 10)
      if (isNaN(result)) {
        throw new TypeError(`${input} cannot be treated as a number`)
      }

      if (result < 1 || result > 200) {
        throw new TypeError('Amount must be between 1 and 200')
      }

      return result
    }
    ,
  }),
}

module.exports = ShazamGrabCommand
