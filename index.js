const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

const questionsJson = {
  "data": [{
    "type": "questions",
    "id": "1",
    "attributes": {
      "name": "Whats up dude?"
    }
  },{
    "type": "questions",
    "id": "2",
    "attributes": {
      "name": "Hows goin?"
    }      
  }]
}

app.get('/', (req, res) => res.send('root response from backend'))

app.get('/questions', cors(), (req, res) => {
  res.send(questionsJson)
})

app.listen(port, () => console.log(`Listening on port ${port}.`))