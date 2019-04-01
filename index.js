const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.get('/', (req, res) => res.send('yo bois'))

app.get('/questions', cors(), (req, res) => {
  res.send({name: 'Jacek'})
})

app.listen(port, () => console.log(`Listening on port ${port}.`))