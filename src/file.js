const { readFile } = require('fs/promises')
const { error } = require('./constants')

const User = require('./user')

const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ['id','name','profession','age']
}

class File {
  static async csvToJson(filePath) {
    const content = await File.getFileContent(filePath)
    const validation = File.isValid(content)
    if (!validation.valid) throw new Error(validation.error)

    const users = File.parseCSVToJSON(content)
    return users
  }

  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString('utf8')
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split('\n')
    const isHeaderValid = header.trim() === options.fields.join(',')

    const fileWithoutHeaderFilter = fileWithoutHeader.filter((index) => index)

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    const isContentLengthAccepted = (
      fileWithoutHeaderFilter.length > 0 &&
      fileWithoutHeaderFilter.length <= options.maxLines
    )

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }

    return { valid: true }
  }

  static parseCSVToJSON(csvString) {    
    const lines = csvString.split('\n')
    const linesNew = lines.map((index) => index.replaceAll('\r', ''))
    //remove o primeiro item e joga para variavel
    const firstLine = linesNew.shift()
    const header = firstLine.split(',')
    const users = linesNew.map(line => {
      const columns = line.split(',')
      let user = {}
      for (const index in columns) {
        user[header[index]] = columns[index]
      }
      return new User(user)
    })
    return users
  }
}

module.exports = File