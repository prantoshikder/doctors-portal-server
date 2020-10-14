const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jf95v.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000;

app.use(bodyParser.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");
    console.log("database connected");
    // console.log(err);
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({ date: date })
            .toArray((err, documents) => {
                // res.send(documents);
                console.log(documents);
            })
    })
});





app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port);
