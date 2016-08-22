var express = require('express');
var app = express();
var path = require('path');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();      
}); 

//use NYtweets.js
app.use('/', require('./nytweets'));
//app.use(express.static(path.join(__dirname, 'static')));

// function sendViewMiddleware(req, res, next) {
//     res.sendView = function(view) {
//     	console.log(__dirname);
//         return res.sendFile(__dirname + "/" + view);
//     }
//     next();
// }

app.use(express.static('.'));

// app.get('/index.html', function(req, res) {
//     res.sendView('search.html');
// });

app.listen(5000, function() {
    console.log('Listening on port 5000');
});


