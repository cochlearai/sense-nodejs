const { FileBuilder } = require("../cochl-sense/lib")
const { readFileSync } = require("fs")

const apiKey = "< Enter API Key >"
file = readFileSync("resources/siren.wav")
format = "wav"

new FileBuilder()
    .withAPIKey(apiKey)
    .withReader(file)
    .withFormat(format)
    .withSmartFiltering(true)
    .build().inference()
    .then(event => {
	    console.log(event.detectedEventTiming())
    })
    .catch(err => {
        console.log(err)
    })
