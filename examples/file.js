const { FileBuilder } = require("cochl-sense")
const { readFileSync } = require("fs")

const apiKey = "<Enter-API-Key>";

file = readFileSync("resources/siren.wav")

new FileBuilder().withAPIKey(apiKey).withFormat("wav").withReader(file).build().inference()
.then(resp => {
    console.log(resp.detectedEventTiming())
})
.catch( err => {
    console.log(err)
})
