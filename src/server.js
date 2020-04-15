const express = require('express')
const connectedDB = require('./dbs/mongoose')
const users = require('./routes/users')
const products = require('./routes/products')
const cart = require('./routes/cart')



const app = express()
const port = process.env.PORT || 5000
connectedDB()

app.use(express.json({
    extended: false
}))
app.use('/users', users)
app.use('/products', products)
app.use('/cart', cart)

app.listen(port, () => console.log(`Server is running on port ${port}`))