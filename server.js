const express = require('express');
const bodyParser = require('body-parser');

const app= express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://18.188.83.191:27017/local";

var db;

MongoClient.connect(url, (err, client) => {
    if (err) return console.log(err)
    db = client.db('mydb') // whatever your database name is
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
  })



app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname+ '/views'));


app.get('/rooms:name', (req, res) =>{
    console.log(req.params.name);
    var query = { name: req.params.name };

    db.collection('User_Rooms').find(query).toArray(function(err, results) {
        if (err) res.send(err);

        res.send(results[0]);
    })
})

app.post('/signIn', (req, res) => {

    var email = JSON.parse(JSON.stringify(req.body)).user.email;
    var password = JSON.parse(JSON.stringify(req.body)).user.password;
})

app.post('signUp', (req, res) => {
    var email = JSON.parse(JSON.stringify(req.body)).user.email;
    var username = JSON.parse(JSON.stringify(req.body)).user.username;
    var password = JSON.parse(JSON.stringify(req.body)).user.password;
    var employer = JSON.parse(JSON.stringify(req.body)).user.employer;
    var department = JSON.parse(JSON.stringify(req.body)).user.department;
    var team = JSON.parse(JSON.stringify(req.body)).user.team;
})



app.post('/chatRoom', (req, res) => {

    var roomId = JSON.parse(JSON.stringify(req.body)).roomId;
    console.log(roomId);
})


var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var tone_analyzer = new ToneAnalyzerV3({
   username: '82a1f1c1-5255-4642-a016-0d8d21294ac2',
   password: 'BSi6j2ZaJp2a',
   version_date: '2017-09-21'
 });

app.post('/analyzeChat', (req, res) => {
    var message = JSON.parse(JSON.stringify(req.body)).message;
    //console.log(message);
// This is tone analyzer provided methods

    var jsontext = '{"text": "' + message +' "}';
    var content = JSON.parse(jsontext);
    var params = {
        'tone_input': content,
        'content_type': 'application/json'
    };
    var data='';
    tone_analyzer.tone(params, function(error, response) {
        if (error)
            console.log('error:', error);
        else

        //data = JSON.stringify(response, null, 2);
        data = response;
        console.log(data);
        }
    );

    res.send(data);

})

app.get('*', (req,res) =>{
    res.sendFile(__dirname + '/views/index.html');
})

const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {
        socket.join(data.room);
        console.log(data.user + ' has joined ' + data.room);
    })

    socket.on('chat message', (data) => {
        console.log(data.user + ':' + data.msg);
        var message = data.msg;
        

        var jsontext = '{"text": "' + message +' "}';
        var content = JSON.parse(jsontext);
        var params = {
            'tone_input': content,
            'content_type': 'application/json'
        };
        var res ='';

        
        
        tone_analyzer.tone(params, function(error, response) {
            if (error)
                console.log('error:', error);
            else
                res = JSON.parse(JSON.stringify(response, null, 2));

            var userInfo = { room: data.room, user: data.user, msg: data.msg };
            var all = Object.assign({}, res, userInfo);
            console.log(all);

            db.collection("Room_chatHistory").insertOne(all, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                
            });
            tech.in(data.room).emit('chat message', all );
        }
        );
       
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})
