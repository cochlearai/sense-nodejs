import { CochlearSense } from "../build/CochlearSense";
import { readFileSync } from "fs";

const apiKey=process.env.SENSE_API_KEY;
const cochlearClient = new CochlearSense(apiKey);

const buffer = readFileSync("./audio_sample.mp3");
const extension = "mp3";

const fileSense = cochlearClient.sendFile(buffer, extension);

//You can also call fileSense.music and filseSense.speech method
fileSense.event((err, result) => {
    if(err) console.error(err);
    else console.log(result);
});
