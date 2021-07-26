// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient({ keyFilename: "food-recommendation-310001-e7c454660ec9.json" });
const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({ keyFilename: "food-recommendation-310001-e7c454660ec9.json" });

// Responsible for converting the given input text to audio format using google cloud text-to-speech api.
// After the conversion the given binary file is saved as a mp3 and stored at given google cloud storage.

module.exports = function () {
    this.recepieAudio = async function recepieAudio(text, index) {

        console.log('Inside google text to speech', text, index);
        console.log('unlinkSync');
        // The text to synthesize
        // Construct the request
        const request = {
            input: { text: text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        try {
            const [response] = await client.synthesizeSpeech(request);
            // Write the binary audio content to a local file

            // const writeFile = util.promisify(fs.writeFile);
            const filePath = 'Step' + index + '.mp3';
            // await writeFile('/tmp/Step' + index + '.mp3', response.audioContent, 'binary');
            const bucketName = 'audio-file-storage-123';
            const gcsFileName = filePath;
            const bucket = storage.bucket(bucketName);
            const file = bucket.file(gcsFileName);

            const stream = file.createWriteStream({
                metadata: {
                    contentType: 'binary',
                },
            });

            stream.on('error', (err) => {
                return err;
            });

            stream.on('finish', () => {
            });

            stream.end(response.audioContent);

            console.log('Create File and return true');
            return true;
        } catch (err) {
            console.log('Error:', error)
            return false;
        }

    }

}
