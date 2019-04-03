const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const uri = 'mongodb+srv://easiv:costam12@jacektv-oritw.mongodb.net/jacekTVDB?retryWrites=true'
const port = 3000

app.use(cors())
app.use(bodyParser.json())

mongoose.connect(uri, {useNewUrlParser: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

const questionSchema = new mongoose.Schema({
  name: String,
  type: String
})

const Question = mongoose.model('question', questionSchema)

let sampleQuestion = new Question({type: 'question', name: 'co tam iksde'})
sampleQuestion.save((err) => err ? console.log(err) : console.log('done'))

app.get('/', (req, res) => res.send('root response from backend'))

app.get('/questions', (req, res) => {
  Question.find((err, question) => { //question argument name has to be the same as ember model name
    if(err) return console.log(err)
    res.send({question}) //braces for taking model name instead of index
  })
})

app.listen(port, () => console.log(`Listening on port ${port}.`))