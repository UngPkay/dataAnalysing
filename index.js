

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
    for(var i = 0 ; i < body.length ; i++){
        mydocx.push(body[i].Question1);
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
var app = express();
var bodyParser = require('body-parser');

    var obj = {
        comment: []
     };

    for(var j = 0 ; j<scoreComment.length ; j++){
        obj.comment.push({id: j, quality: scoreComment[j]});
    }

   
    var json = JSON.stringify(obj);
    console.log(json);
    var currentId = scoreComment.length;
    console.log(currentId);

    var PORT = process.env.PORT || 3000;

    app.use(express.static(__dirname));
    app.use(bodyParser.json());

    // Get Json
    app.get('/api/comment', function(req, res, next){

        res.send(json);

    });
    // app.get('/api/comment/:id', function(req, res){

    //     const comment = json.find(c => c.id === parseInt(req.params.id));
    //     if(!comment)
    //         res.status(404).send('The couse with the given ID was not found');
        
    //         res.send(comment);
        
   

    // });

    // Post Json
    app.post('comment', function(req, res){

        var userComment = req.body.quality;
        currentId++;

        quality.push({
            id: currentId,
            quality: userComment
        });

        res.send('Successfully created product!');

    });

    // Put Json
    app.put('comment/:id', function(req, res){

        var id = req.params.id;
        var newUserComment = req.body.newUserComment;

        var found = false;

        quality.forEach(function(quality, index){
            if(!found && quality.id === Number(id)){
                quality.userComment = newUserComment;
            }
        });
        res.send('Sucessfully updated product!');

    });

    // Update Json
    app.delete('comment/:id', function(req,res){

        var id = req.params.id;
        var found = false;

        quality.forEach(function(quality, index){
            if(!found && quality.id === Number(id)){
                quality.splice(index, 1);
            }
        })
        res.send('Successfully deleted product!!!');

    });

    app.listen(PORT, function(){

        console.log('Server listening on ' + PORT);
         
    })


 }



