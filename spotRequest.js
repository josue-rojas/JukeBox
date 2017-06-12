var request = require('request'); // "Request" library
var express = require('express');
var parser = require('body-parser');
var app = express();
app.use(parser.json());


var client_id = "";
var client_secret = "";
var songURL = ''
var reqURL = '/spot'

//this post the data to make the api endpoint for track
app.post(reqURL, function(req, res){
  var link = req.body.song.split("/")
  songURL = 'https://api.spotify.com/v1/tracks/' + link[link.length-1];
});

//this is to post the keys
//check for error later
app.post("/keys", function(req, res){
  client_id = req.body.clientID;
  client_secret = req.body.clientSecret;
});


app.get(reqURL,function(req, res){
  var preURL = "";

  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };


  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: songURL,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        res.send(body);
      });
    }
  });

});


app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
