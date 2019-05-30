import { CochlearSense } from "../build/CochlearSense";

import { readFileSync } from "fs";

const apiKey=process.env.SENSE_API_KEY;
const buffer = readFileSync("./audio_sample.mp3");
const extension = "mp3";

const client = new CochlearSense(apiKey);
client.speech(buffer, extension, (err, response) => {
    if(err){
        console.error(err);
    } else {
        console.log(response);
    }
})