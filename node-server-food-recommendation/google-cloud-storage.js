// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({ keyFilename: "food-recommendation-310001-e7c454660ec9.json" });

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'audio-file-storage-123';

// The origin for this CORS config to allow requests from
const origin = '*';

// The response header to share across origins
const responseHeader = ["X-Requested-With", "Access-Control-Allow-Origin", "Content-Type"];

// The maximum amount of time the browser can make requests before it must
// repeat preflighted requests
const maxAgeSeconds = 3600;

// The name of the method
// See the HttpMethod documentation for other HTTP methods available:
// https://cloud.google.com/appengine/docs/standard/java/javadoc/com/google/appengine/api/urlfetch/HTTPMethod
const method = '*';

async function configureBucketCors() {
    await storage.bucket(bucketName).setCorsConfiguration([
        {
            maxAgeSeconds,
            method: [method],
            origin: [origin],
            responseHeader: [responseHeader],
        },
    ]);

    console.log(`Bucket ${bucketName} was updated with a CORS config
      to allow ${method} requests from ${origin} sharing 
      ${responseHeader} responses across origins`);
}


copyFileToGCS().catch(console.error);


async function copyFileToGCS(options, audioBuffer) {
    options = options || {};
    const localFilePath = './Step4.mp3';
    const bucketName = 'audio-file-storage-123';
    const bucket = storage.bucket(bucketName);
    const fileName = 'Step4.mp3';
    const file = bucket.file(fileName);

    return bucket.upload(localFilePath, options)
        .then(() => file.makePublic())
        .then(() => exports.getPublicUrl(bucketName, gcsName));
};

	
async function sendUploadToGCS (audioBuffer)  {

    const bucketName = 'audio-file-storage-123';
    const gcsFileName = 'Test.mp3';
    const file = 'Test.mp3';
  
    const stream = file.createWriteStream({
      metadata: {
        contentType: 'binary',
      },
    });
  
    stream.on('error', (err) => {
    //   req.file.cloudStorageError = err;
      return err;
    });
  
    stream.on('finish', () => {
    //   req.file.cloudStorageObject = gcsFileName;
      return file.makePublic()
        .then(() => {
          return gcsHelpers.getPublicUrl(bucketName, gcsFileName);
        //   next();
        });
    });
  
    stream.end(audioBuffer);
  };