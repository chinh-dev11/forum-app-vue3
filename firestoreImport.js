const { initializeFirebaseApp, restore } = require('firestore-export-import')
const { readFileSync, writeFileSync, unlinkSync } = require('fs')
const { dirname } = require('path')

const { databaseURL } = require('./src/config/firebase.js')
const serviceAccount = require('./serviceAccount.json')

const _dirname = dirname(__filename)
const dataFile = `${_dirname}/src/data.json`
const tempFile = `${_dirname}/data-temp.json`

// procedure
const init = async () => {
  const fileContents = readFileSync(dataFile, 'utf8')

  const data = JSON.parse(fileContents)
  const transformed = transformDataForFirestore(data)

  writeFileSync(tempFile, JSON.stringify(transformed))

  await jsonToFirestore()

  unlinkSync(tempFile)
}

// Helper Functions
// -------------------------------------

// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase')
    const firestore = initializeFirebaseApp(serviceAccount, databaseURL)

    console.log('Uploading data...')
    await restore(firestore, tempFile)

    console.log('Upload Success')
  } catch (error) {
    console.log(error)
  }
}

// In order to preserve ids in data.json
// as ids in firestore
// must use keyed object (id being the key) instead of array of records
const transformDataForFirestore = (data) => {
  const collections = data
  delete collections.stats
  const collectionsById = {}

  Object.keys(collections).forEach((collectionKey) => {
    collectionsById[collectionKey] = {}
    const collection = collections[collectionKey]

    collection.forEach((record) => {
      collectionsById[collectionKey][record.id] = record
      delete collectionsById[collectionKey][record.id].id
    })
  })

  return collectionsById
}

init()
