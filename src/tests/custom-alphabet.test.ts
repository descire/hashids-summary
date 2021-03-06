/* eslint-disable jest/expect-expect */
import Hashids from '../hashids'

describe('custom alphabet', () => {
  const testAlphabet = (alphabet: string) => {
    const hashids = new Hashids('', 0, alphabet)
    const numbers = [1, 2, 3]

    const id = hashids.encode(numbers)
    const decodedNumbers = hashids.decode(id)

    expect(decodedNumbers).toEqual(numbers)
  }

  it(`should work with the worst alphabet`, () => {
    testAlphabet('cCsSfFhHuUiItT01')
  })

  it(`should work with an alphabet containing spaces`, () => {
    testAlphabet('cCsSfFhH uUiItT01')
  })

  it(`should work with half the alphabet being separators`, () => {
    testAlphabet('abdegjklCFHISTUc')
  })

  it(`should work with exactly 2 separators`, () => {
    testAlphabet('abdegjklmnopqrSF')
  })

  it(`should work with no separators`, () => {
    testAlphabet('abdegjklmnopqrvwxyzABDEGJKLMNOPQRVWXYZ1234567890')
  })

  it(`should work with super long alphabet`, () => {
    testAlphabet(
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]',
    )
  })

  it(`should work with a weird alphabet`, () => {
    testAlphabet('`~!@#$%^&*()-_=+\\|\'";:/?.>,<{[}]')
  })

  it(`should work with an alphabet with unicode chars`, () => {
    testAlphabet('ππππ€£πππππππππππ₯°πππ')
  })

  it(`should work with an alphabet with complex unicode chars`, () => {
    testAlphabet('π€Ίπ©πΏβπ¦³ππ©π»π¦·π€¦ββοΈπβπΌβπΎππ½πΈπ°β€οΈπ­')
  })

  it(`should work with alphabet that contains emojis that are subsets of each other`, () => {
    testAlphabet('ππ§π½βπ¦³π§π·π©πΏβπ¦°π©πΎβπ¦°π©π½βπ¦°π©π»βπ¦°βπΎππ½π©π»π¦·π€¦ββοΈ')
    testAlphabet('ππ§π§π½βπ¦³π·π©π»βπ¦°π©πΏβπ¦°π©π½βπ¦°π©πΎβπ¦°βπΎππ½π©π»π¦·π€¦ββοΈ')
  })
})
