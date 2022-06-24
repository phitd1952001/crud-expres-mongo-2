// server.js

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const connectionString = 'mongodb+srv://root:Abcd1234@cluster0.2azum.mongodb.net/ToyStore?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('ToyStore')
        const quotesCollection = db.collection('quotes')

        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        app.set('view engine', 'ejs')


        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))

            // ...
            //res.sendFile(__dirname + '/index.html')
        })

        // get <form action="/quotes" method="POST"> from index.html after submission
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.listen(process.env.PORT || 3000, function() {
            console.log('listening on 3000')
        })


    })
    .catch(error => console.error(error))