
var getTweets = function (query) {
 
   // Send a search request to Twitter
   var request = http.request({
      host: "search.twitter.com",
      port: 80,
      method: "GET",
      path: "/search.json?since_id=" + Twitter.latestTweet + "result_type=recent&rpp=5&q=" + query
   })
}