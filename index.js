const express = require('express');
const app = express();
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 3100});

wss.getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};
  
wss.on('connection', function connection(ws) {
  ws.id = wss.getUniqueID();

  ws.on('message', function incoming(data) {

    wss.clients.forEach(function each(client) {
      client.send(JSON.stringify(client.id))
      client.send(data);
    });
  });
});

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = 'mongodb+srv://easiv:costam12@jacektv-oritw.mongodb.net/jacekTVDB?retryWrites=true';
const port = 3000;

const logger = (req, res, next) => {
  console.log(req.body);
  console.log(res.body);
  next()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(logger)

mongoose.connect(uri, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

const questionSchema = new mongoose.Schema({
  ident: String,
  name: String
})

const userSchema = new mongoose.Schema({
  name: String,
  isOwner: Boolean,
  roomId: String,
  currentAnswer: String,
  points: Number
})

const roomSchema = new mongoose.Schema({
  name: String,
  userList: Array,
  presentQuestions: Array,
  usedQuestions: Array,
  answeredQuestions: Array,
  hasStarted: Boolean,
  writingPhase: Boolean,
  comparePhase: Boolean,
  finalPhase: Boolean
})

const Question = mongoose.model('question', questionSchema);
const User = mongoose.model('user', userSchema);
const Room = mongoose.model('room', roomSchema);

app.get('/', (req, res) => {
  res.send('root response from backend');
})

app.get('/questions', (req, res) => {
  Question.find((err, question) => { //question argument name has to be the same as ember model name
    if(err) return console.log(err)
    res.send({question}) //braces for taking model name instead of index
  })
})

app.get('/questions/:id', (req, res) => {
  let _id = req.params.id;

  Question.findOne({_id}, (err, question) => {
    if(err) console.log(err)
    res.send({question})
  })
})

app.post('/questions', (req, res) => {
  const name = req.body.question.name
  let newQuestion = new Question({name, ident: null});
  newQuestion.ident = newQuestion._id;

  newQuestion.save(err => err ? console.log(err) : console.log(`Question ${name} successfully saved`))
})

app.put('/questions/:id', (req, res) => {
  let _id = req.params.id
  let name = req.body.question.name;

  Question.updateOne({_id}, {name}, err => {
    err ? console.log(err) : console.log('Question successfully updated')
  })
})

app.delete('/questions/:id', (req, res) => {
  let _id = req.params.id

  Question.deleteOne({_id}, (err) => err ? console.log(err) : console.log(`Question successfully deleted`))
  res.send({})
})

app.get('/users', (req, res) => {
  User.find((err, user) => {
    if(err) console.log(err)
    res.send({user})
  })
})

app.get('/users/:id', (req, res) => {
  let _id = req.params.id
  
  User.findOne({_id }, (err, user) => {
    if(err) console.log(err)
    res.send({user})
  })
})

app.post('/users', (req, res) => {
  const name = req.body.user.name;
  const isOwner = req.body.user.isOwner;
  const roomId = req.body.user.roomId;
  const currentAnswer = req.body.user.currentAnswer;
  const points = req.body.user.points;

  let user = new User({name, isOwner, roomId, currentAnswer, points})
  user.save(err => err ? console.log(err) : console.log(`User ${name} successfully created`))
  res.send({user})
})

app.put('/users/:id', (req, res) => {
  let _id = req.params.id;
  let name = req.body.user.name;
  let isOwner = req.body.user.isOwner;
  let roomId = req.body.user.roomId;
  let currentAnswer = req.body.user.currentAnswer;
  let points = req.body.user.points;

  User.updateOne({_id}, {name, isOwner, roomId, currentAnswer, points}, err => {
    err ? console.log(err) : console.log(`User ${name} successfully updated`);
  })
})

app.post('/rooms', (req, res) => {
  const name = req.body.room.name;
  const userList = req.body.room.userList;
  const usedQuestions = req.body.room.usedQuestions;
  const presentQuestions = req.body.room.presentQuestions;
  const answeredQuestions = req.body.room.answeredQuestions;
  const hasStarted = req.body.room.hasStarted;
  const writingPhase = req.body.room.writingPhase;
  const comparePhase = req.body.room.comparePhase;
  const finalPhase = req.body.room.finalPhase;

  let room = new Room({name, userList, presentQuestions, usedQuestions, answeredQuestions,
                       hasStarted, writingPhase, comparePhase, finalPhase});
  room.save(err => err ? console.log(err) : console.log(`Room ${name} successfully created`));
  res.send({room})
})

app.get('/rooms/:id', (req, res) => {
  let _id = req.params.id;

  Room.findOne({_id}, (err, room) => {
    if(err) err => console.log(err)
    res.send({room})
  })
})

app.put('/rooms/:id', (req, res) => {
  let _id = req.params.id
  let name = req.body.room.name;
  let userList = req.body.room.userList;
  let presentQuestions = req.body.room.presentQuestions;
  let usedQuestions = req.body.room.usedQuestions;
  let answeredQuestions = req.body.room.answeredQuestions;
  let hasStarted = req.body.room.hasStarted;
  let writingPhase = req.body.room.writingPhase;
  let comparePhase = req.body.room.comparePhase;
  let finalPhase = req.body.room.finalPhase;

  Room.updateOne({_id}, {name, userList, hasStarted, writingPhase, presentQuestions,
                         answeredQuestions, usedQuestions, comparePhase, finalPhase}, err => {
    err ? console.log(err) : console.log('Room successfully updated')
  })
})

app.listen(port, () => console.log(`Listening on port ${port}.`))