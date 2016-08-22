function searchResults(data){
	console.log(data);
	console.log(uniqRound);
	var hashs = [];
	var relatedTweets = [];
	var tweetHis = [];

	for(var i = 0; i < data['aggregations']['hashtags']['buckets'].length; i++){
		hashs.push(data['aggregations']['hashtags']['buckets'][i]);
		tweetHis.push(data['aggregations']['hashtags']['buckets'][i]["tweets_per_hour"]["buckets"])
	}
	for(var i = 0; i < data["hits"]["hits"].length; i++){
        var source =  data["hits"]["hits"][i]["_source"];
        source.text = data["hits"]["hits"][i].highlight.text[0];
        relatedTweets.push(source);
    }
	//plot Hashtags for passive interaction
    settings = setup('#topBar');
    redraw(settings, hashs);
    //console.log(tweetHis);
    for(var i = 0; i < tweetHis.length; i++){
        
	    drawBar('.hashLine'.concat(i), tweetHis[i]);
	};

	//plot tweet list
    setUps = init('#tweetList');
    redrawTweetDetail(setUps, relatedTweets);

    //Concatinate hashtag parameter
    searchTweetDetail(hashs[uniqRound]["key"]);

    if(uniqRound < (data['aggregations']['hashtags']['buckets'].length - 1)){
        uniqRound++;
    } else {
        uniqRound = 0;
    };
};

function searchDetail(hashdata, round){
    console.log(hashdata);
    var relatedTweets=[];
    var actualCoordinate = [];
    var clusterCoordinate = [];
    var keywords =[];
    //sort by followers_count
    for(var i = 0; i < hashdata["hits"]["hits"].length; i++){
        var source =  hashdata["hits"]["hits"][i]["_source"];
        source.text = hashdata["hits"]["hits"][i].highlight.text[0];
        relatedTweets.push(source);
    }

    for(var i = 0; i < hashdata["aggregations"]["keyword"]["buckets"].length; i++){
    	keywords.push(hashdata["aggregations"]["keyword"]["buckets"][i]);
    }

    // relatedTweets.sort(function(a,b){ 
    //     //return b["id"]-a["id"]
    //     return (0.5*b["user"]["followers_count"] + 0.5*b["retweet_count"] ) - (0.5*a["user"]["followers_count"] + 0.5*b["retweet_count"]); 
    // });

	//plot keyword
    setKeyword = setkey('#keywordPanel');
    redrawAllKey(setKeyword, keywords);

    //plot tweet list
    setUps = init('#relateTweet');
    redrawTweetDetail(setUps, relatedTweets);

    for(var i = 0; i < relatedTweets.length; i++){
        actualCoordinate.push(relatedTweets[i]["coordinates"]);
    };
    
    var overlap = [];
    var radius = [];
    for(var i=0; i < relatedTweets.length; i++) {
        overlap.push(false);
        radius.push(1.0);
    }
    for(var i = 0; i < relatedTweets.length; i++){
        if (!overlap[i]) {
            for(var n = i+1; n < relatedTweets.length; n++){
                if(Math.abs(relatedTweets[i]["coordinates"]["coordinates"][0] - relatedTweets[n]["coordinates"]["coordinates"][0]) < 0.0005 && Math.abs(relatedTweets[i]["coordinates"]["coordinates"][1] - relatedTweets[n]["coordinates"]["coordinates"][1]) < 0.0005){
                    overlap[n] = true;
                    radius[i] += 0.1;
                    radius[n] = 0;
                }
            }            
        }
    };
    
    //plot map
    tweetsMap(actualCoordinate, radius);
    //console.log(uniqRound);
};