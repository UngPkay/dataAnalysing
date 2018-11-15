

// Get file json from server
var request = require("request")

var url = "https://surveyapiv120181102014558.azurewebsites.net/Api/Questions"

request({
    url: url,
    json: true
}, function (error, response, body) {
analysingData(body)
    //console.log(body);
})

 // analysing data from server
 function analysingData(body){
    
    var Sentiment = require('sentiment');
    var sentiment = new Sentiment();
    var mydocx = [];
    var mydocxDate = [];
    for(var i = 0 ; i < body.length ; i++){
        mydocx.push(body[i].Question1);
        mydocxDate.push(body[i].Date);
    }
    //var mydocx = ["I like apples","I don't oranges","The movies are so fantastic and more powerful","This book is the best in the world"];
    var scoreComment = [];
    mydocx.forEach(function(s){
      scoreComment.push(sentiment.analyze(s).score);
        //console.log("Sentiment: "+sentiment.analyze(s).score);     
    })

    console.log(scoreComment);

// exporting file json to server
var express = require('express');

const cors = require('cors');
var app = express();
app.use(express.static('index.html'));
var bodyParser = require('body-parser');

    var obj = {
        comment: []
     };

    for(var j = 0 ; j<scoreComment.length ; j++){
        obj.comment.push({id: j,
                         quality: scoreComment[j],
                         date: mydocxDate[j]
                        });
    }
    
   
    var json = JSON.stringify(obj);
    console.log(json);
    var currentId = scoreComment.length;
    console.log(currentId);

    var PORT = process.env.PORT || 3000;

    app.use(express.static(__dirname));
    app.use(bodyParser.json());

    // Get Json
    app.get('/comment/', cors({ methods:['GET']}), function(req, res){

        res.send(json);

    });
   
    


    app.listen(PORT, function(){

        console.log('Server listening on ' + PORT);
         
    })



 }



