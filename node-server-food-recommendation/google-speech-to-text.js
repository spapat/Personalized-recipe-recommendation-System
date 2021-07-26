const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient({ keyFilename: "food-recommendation-310001-e7c454660ec9.json" });

// Responsible for converting a given audio buffer into specific text and returning it .
const googleTextToSpeech = async (audioBuffer) => {    
    const audio = {
      content: audioBuffer
    };
    const config = {
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };
  
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    return transcription;
}

exports.googleTextToSpeech = googleTextToSpeech;