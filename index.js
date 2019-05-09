const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = 'mongodb+srv://easiv:costam12@jacektv-oritw.mongodb.net/jacekTVDB?retryWrites=true';
const port = 3000

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
  userList: Array
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
    res.send({question: question}) //braces for taking model name instead of index
  })
})

app.get('/questions/:id', (req, res) => {
  Question.find((err, question) => {
    if(err) console.log(err)
    res.send({question: question})
  })
})

app.post('/questions', (req, res) => {
  const name = req.body.question.name
  let newQuestion = new Question({name});
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
  res.json({})
})

app.get('/users', (req, res) => {
  User.find((err, user) => {
    if(err) console.log(err)
    res.send({user})
  })
})

app.get('/users/:id', (req, res) => {
  let _id = req.params.id
  
  User.findOne({ _id }, (err, user) => {
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
  res.json({user})
})

app.post('/rooms', (req, res) => {
  const name = req.body.room.name;
  const userList = req.body.room.userList;

  let room = new Room({name, userList});
  room.save(err => err ? console.log(err) : console.log(`Room ${name} successfully created`));
  res.json({room})
})

app.get('/rooms/:id', (req, res) => {
  Room.find((err, room) => {
    if(err) err => console.log(err)
    res.send({room})
  })
})

app.put('/rooms/:id', (req, res) => {
  let _id = req.params.id
  let name = req.body.room.name;
  let userList = req.body.room.userList;

  Room.updateOne({_id}, {name, userList}, err => {
    err ? console.log(err) : console.log('Room successfully updated')
  })
})

app.listen(port, () => console.log(`Listening on port ${port}.`))