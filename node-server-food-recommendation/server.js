require('dotenv').config()

const express = require('express');
const app = express();
const connection = require('./database_2');
require('./google-text-to-speech')();
const cors = require('cors')
const ms = require('mediaserver');
const multer = require('multer');
const calendar = require('./google_calendar');
const sheets = require('./google-sheets');

const googleSpeechText = require('./google-speech-to-text');
const googleDialogFlow = require('./google-dialog-flow');
// Adding this to resolve cors issue of angular
app.use(cors());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded());


// Fetch recepie based on title 
app.route('/api/recipe/:Title')
  .get(function (req, res, next) {
    connection.query(
      "SELECT * FROM `receipe1` WHERE name = ? LIMIT 10", req.params.Title,
      function (error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });

// Fetch first 30 recepies
app.route('/api/recipeList')
  .get(function (req, res, next) {
    connection.query(
      "SELECT * FROM `receipe1` LIMIT 30",
      function (error, results2, fields) {
        if (error) throw error;
        res.json(results2);
      }
    );
  });

// To check the code 
app.get('/api/status', (req, res) => res.json('Working!'));

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.post('/api/calendar', (req, res) => {
  const date = req.body.date;
  const recepieTitle = req.body.title;
  const description = req.body.description;
  return calendar.insertCalendarEvent(date, recepieTitle, description);
}
);

app.get('/api/recipeAudio/:Steps', (req, res) => {
  return recepieAudio(JSON.parse(req.params.Steps)).then(result => {
    return res.json(result);
  });
});

app.get('/api/getIngredientsPrice', (req, res) => {
  return sheets.readSpreadSheet().then(result => {
    return res.json(result);
  })
});

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 8080);
app.listen(8080);

app.get('/get_audio/:filename', function (req, res) {
  ms.pipe(req, res, './' + req.params.filename);
});

app.post('/api/storeIngredients', async function (req, res) {
  console.log("Getting Ingredients List");
  const list = req.body.list;
  return sheets.storeValuesinSpreadSheet(list);
});

app.post('/api/upload_sound', async function (req, res) {
  console.log("Getting text transcription..");
  let transcription = await googleSpeechText.googleTextToSpeech(req.body.buffer);
  console.log("Text transcription: " + transcription);
  if (transcription.length > 0) {
    return googleDialogFlow.runDialogFlow(transcription, res);
  }

  return res.json('');
});

app.post('/api/send_recipe_step', function (req, res) {
  const step = req.body.step;
  const index = req.body.index;
  console.log("Steps details:" + step + ' index:' + index);
  return recepieAudio(step, index).then(result => {
    return res.json(result);
  });
});

