var http = require("http"),
    url=require("url"),
    path=require("path"),
	fs=require("fs"),
	events=require("events"),
	sys = require("sys");

var twitter = (function(){
    var emitter = new events.EventEmitter();
	
    return {
        eventEmitter : emitter,  // The event broadcaster
        latestTweet : 0               // The ID of the latest searched tweet		
    };
})();

function getTweets(query) {
	
	var request = http.request({
		host: "search.twitter.com",
		port: 80,
		method: "GET",
		path: "/search.json?since_id=" + twitter.latestTweet + "result_type=recent&rpp=5&q=" + query
	})
	
    .on("response", function(response){
		var body = "";
		
		response.on("data", function(data){
			body += data;
			
			try {
				var tweets = JSON.parse(body);
				
				if (tweets.results.length > 0) {
					twitter.latestTweet = tweets.max_id_str;
					twitter.eventEmitter.emit("tweets", tweets);
				}
				
				twitter.eventEmitter.removeAllListeners("tweets");
			} 
			catch (ex) {
				console.log("waiting for more data chunks...");
			}
		});
	});

	request.end();
}


module.exports = function(app) {
	app.get('/twitter', function(req, res) {
		
        var timeout = setTimeout(function() {  
            res.writeHead(200, { "Content-Type" : "text/plain" });  
            res.write(JSON.stringify([]));  
            res.end();  
        }, 20000);
    
	    twitter.eventEmitter.once("tweets", function(tweets) {
			res.writeHead(200, {
				"Content-Type": "text/plain"
			});
			res.write(JSON.stringify(tweets));
			res.end();
			
			clearTimeout(timeout);
		});

        var query = req.query['tag'];
		
        getTweets(query);
        
	});
}