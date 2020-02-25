const express = require('express')
const connectedDB = require('./dbs/mongoose')




const app  = express()
const port = process.env.PORT || 5000
connectedDB()

app.use(express.json({ extended: false}))

app.get('/', (req, res) => {
res.send('Welcome back to coding Danny')
})

app.listen(port, () => console.log(`Server is running on port ${port}`))