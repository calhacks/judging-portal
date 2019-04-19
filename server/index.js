const express = require('express');
const Router = require('express-promise-router');
const path = require('path');
var bodyParser = require('body-parser');
const db = require('./db/index');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

// const db = {
//   'apis': [],
//   'general_categories': [],
//   'fellowships': [],
//   'tables': '',
//   'clusters': '',
//   'waves': '',
//   'filename': 'UPLOAD FILE',
//   "judge_list": [],
//   "projects": []
// }

// ########### HOME API EXAMPLES BEGIN ###########

app.get('/api/home', async (req, res) => {
  try {
    const query = await db.query('SELECT * FROM judges;');
    res.send(query.rows);
  } catch (error) {
    console.log(error.stack);
  }
});

app.post('/api/dummy', async (req, res) => {
  const { dummy } = req.body;
  db.query('INSERT INTO judges(name, API, projectId, score) VALUES($1 ,$2, $3, $4)', [
      dummy,
      "mentoredAPI",
      1,
      -1
    ]);
  res.json("You successfully posted: ".concat(dummy));
});

app.put('/api/score/:judgeName', async (req, res) => {
  const { judgeName } = req.params;
  const { projectId, score } = req.body;
  console.log(judgeName, projectId, score);
  db.query('UPDATE judges SET score = $1 WHERE name = $2 AND projectId = $3;', [
    score,
    judgeName,
    projectId
  ]);
  res.json('Score update successfully');
});

// ########### HOME API EXAMPLES END ###########

// API endpoint for projects
app.get('/api/projects', async (req, res) => {
  try {
    const query = await db.query('SELECT * FROM projects;');
    res.send(query.rows);
  } catch (error) {
      console.log(error.stack);
  }
});

// API endpoint for judge names
app.get('/api/judgenames', async (req, res) => {
    try {
      const query = await db.query('SELECT name FROM judges;');
      res.send(query.rows);
    } catch (error) {
      console.log(error.stack);
    }
});

app.get('/api/lists', async (req, res) => {
  try {
    const query = await db.query('SELECT * FROM lists;');
    res.send(query.rows);
  } catch (error) {
    console.log(error.stack)
  }
});


app.post('/api/lists', async (req, res) => {
  const {deleted, added } = req.body;
  console.log(deleted);
  var i;
  for (i = 0; i < deleted.length; i++) {
    console.log("DELETING: " + deleted[i]);
    db.query('DELETE FROM lists WHERE type=\'' + deleted[i][0] +'\' AND name=\'' + deleted[i][1]+'\';');
    console.log('DELETE FROM lists WHERE type=\'' + deleted[i][0] +'\' AND name=\'' + deleted[i][1]+'\';');
  }
  for (i = 0; i < added.length; i++) {
    console.log("ADDING: " + added[i]);
    db.query('INSERT INTO lists VALUES(\'' + added[i][0] + '\', \'' + added[i][1] +'\');');
    console.log('INSERT INTO lists VALUES(\'' + added[i][0] + '\', \'' + added[i][1] +'\');');
  }
  
  res.json("Databse has been updated");

});

app.get('/api/judgeinfo', (req, res) => {
  const judgeinfo = db['judge_list']

  // Return them as json
  res.json(judgeinfo);
  console.log(`Sent APIs`)
});

app.get('/api/data', async (req, res) => {
  try {
    const query = await db.query('SELECT * FROM dataentry;');
    res.send(query.rows);
  } catch (error) {
    console.log(error.stack);
  }
})

app.put('/api/data', async (req, res) => {
  console.log('entered put');
  const { tables, clusters, waves, filename, csv} = req.body;
  db.query('UPDATE dataentry SET tables = $1, clusters = $2, waves = $3, filename = $4;', [
      tables,
      clusters,
      waves,
      filename
    ]);
  var i;
  for (i = 1; i < csv.length; i++) {
    //console.log(csv[i]); // to check that theyve all been put in
    const project = csv[i];
    db.query('INSERT INTO csv (name, url, BestMobileApp, BestWebApp, BestHardwareHack, BestVRHack, BestMLHack, BestHealthHack, BestEducationHack, BestEntertainmentHack, BestBeginnerHack) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);', [
      project['Submission Title'],
      project['Submission Url'],
      project['Best Mobile App'],
      project['Best Web App'],
      project['Best Hardware Hack'],
      project['Best VR Hack'],
      project['Best ML Hack'],
      project['Best Health Hack'],
      project['Best Education Hack'],
      project['Best Entertainment Hack'],
      project['Best Beginner Hack']
    ])
  }
  res.json("You successfully posted to dataentry");
});

app.get('/api/apis', async (req, res) => {
  try {
    const query = await db.query('SELECT (api) FROM lists;');
    res.send(query.rows);
  } catch (error) {
    console.log(error.stack)
  }
});

app.get('/api/judgeinfo', async (req, res) => {
  try {
    const query = await db.query('SELECT * FROM judges;');
    res.send(query.rows);
  } catch (error) {
    console.log(error.stack);
  }
});

app.post('/api/judgeinfo', async (req, res) => {
  const { info, deleted } = req.body;
  res.json()
  db.query('INSERT INTO judges(name, API) VALUES($1 ,$2)', [
      info[0],
      info[1]
  ]);
  var i;
  for (i = 0; i < deleted.length; i++) {
    db.query('DELETE FROM judges WHERE name=\'' + deleted[i][0] +'\' AND API=\'' + deleted[i][1]+'\';');
    console.log('DELETE FROM lists WHERE type=\'' + deleted[i][0] +'\' AND name=\'' + deleted[i][1]+'\';');
  }
  res.json("You successfully posted: ".concat(info));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Database listening on ${port}`);
