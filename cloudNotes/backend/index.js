const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 5000


app.use(cors())
//Amra jodi use kortey chai request.body kee tokhon amader kee ues kortey hobey middle ware jeta rr nam holo app.use(express.json());
app.use(express.json())//eta holo ekta middleware

//Available Routs
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})
