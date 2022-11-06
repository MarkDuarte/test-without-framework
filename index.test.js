const { error } = require('./src/constants')
const File = require('./src/file')
const { rejects, deepStrictEqual } = require('assert')

async function test() {
  {
    const filePath = './mocks/emptyFile-invalid.csv'
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)
    await rejects(result, rejection)
  }
  {
    const filePath = './mocks/fourItens-invalid.csv'
    const rejection = new Error(error.FILE_LENGTH_ERROR_MESSAGE)
    const result = File.csvToJson(filePath)
    await rejects(result, rejection)
  }
  {
    const filePath = './mocks/threeItens-valid.csv'
    const result = await File.csvToJson(filePath)
    const expected = [
        {
          "name": "Marcos Duarte",
          "id": 123,
          "profession": "Develop Javascript",
          "birthDay": 1995
        },
        {
          "name": "Xuxa da Silva",
          "id": 321,
          "profession": "Develop Expert",
          "birthDay": 1942
        },
        {
          "name": "Joaozinho do lol",
          "id": 456,
          "profession": "Develop Java",
          "birthDay": 1997
        }
      ]
    
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected))
  }
}

test();