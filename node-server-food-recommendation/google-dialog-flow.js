
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
// A unique identifier for the given session
const sessionId = uuid.v4();
const projectId = 'node-312122';
// Create a new session
const sessionClient = new dialogflow.SessionsClient({ keyFilename: "application_default_credentials.json" });
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

const runDialogFlow = async(text, res) => {

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
    return res.json(result.fulfillmentText);
}

exports.runDialogFlow = runDialogFlow;