var express = require('express');
var app = express();
const path = require('path');
const MongoClient = require('mongodb').MongoClient
const KindredAPI = require('kindred-api')
const REGIONS = KindredAPI.REGIONS
const LIMITS = KindredAPI.LIMITS
const QUEUES = KindredAPI.QUEUE_TYPES
const InMemoryCache = KindredAPI.InMemoryCache
const RedisCache = KindredAPI.RedisCache
const debug = true
const k = new KindredAPI.Kindred({
    key: String(args[0]),
    defaultRegion: REGIONS.NORTH_AMERICA,
    limits: LIMITS.DEV, // [[20, 1], [100, 120]] 20 reqs/1s. 100 reqs/2m.
    debug: true,
    showHeaders: true,
    spread: true,
    timeout: 10000, // 10 seconds
    cache: new InMemoryCache()
  })
const Q_STRINGS = KindredAPI.QUEUE_STRINGS
const Twitch = require('twitch.tv-api');
const twitch = new Twitch({
    id: "gt5rydttabltw2zpx5laipwpz4qulp",
    secret: String(args[1])
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

let results;
let clusters = [];
let gameids = [];
let currentcluster = [];

MongoClient.connect('mongodb://Ajkthx:Vice_roy1@ds145871.mlab.com:45871/streamers', (err, client) => {

    var db = client.db('streamers');

    let foo = function() {
        clusters = currentcluster;
        currentcluster = [];
        console.log("Interval Started");
        gameids = [];
        db.collection('streams').find().toArray((err, result) => {
            results = result;
            result.map((item) => {
                item.summonerId.map(id => {
                    k.CurrentGame.get({ summonerId: Number(id) })
                    .then(data => {
                        let arr = [{ "gameId" : String(data.gameId) }];
                        data.participants.map(participant => {
                            db.collection('streams').findOne({ "summonerId" : String(participant.summonerId) }, function(err, result) {
                                if (err) throw err;
                                if (result) {
                                    twitch.getUser(String(result.streamId))
                                        .then(data => {
                                            if (data.stream == null) {
                                                arr.push({ "name" : String(result.name), "summonerId" : String(result.summonerId), "streamId" : String(result.streamId), "Status" : "Offline" } );
                                            }
                                            if (data.stream.viewers) {
                                                arr.push({ "name" : String(result.name), "summonerId" : String(result.summonerId), "streamId" : String(result.streamId), "Status" : "Live" } );
                                            }
                                        })
                                        .catch(() => {});
                                    
                                }
                            });
                           
                        });
                        //console.log(currentcluster.inserted);
                        if (!gameids.includes(arr[0].gameId)) {
                            if (currentcluster.indexOf(arr) === -1) {
                                currentcluster.push(arr);
                            }
                        }

                        if (!gameids.includes(String(data.gameId))) {
                            gameids.push(String(data.gameId));
                        }
                    })
                    .catch(() => {})
                });
            });
        });
    }

    foo();
    setInterval(foo, 300000);


});

app.get('/', function (req, res) {
  res.send(results);
});

app.get('/test', function (req, res) {
    res.send(clusters);
});

app.get('/test2', function (req, res) {
    res.send(currentcluster);
});

app.get('/test3', function (req, res) {
    res.sendFile(path.join(__dirname, '/backend.zip'));
});

app.get('/diddle', function (req, res) {
    res.sendFile(path.join(__dirname, '/cockass.jpg'));
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});