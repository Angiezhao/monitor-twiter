var q1Times =0;
var q2Times =0;
var hashTimes=0;

var searchTurn = false;
var key="nyc";
var loc="New York";
var dur="now-" + document.getElementById("duration").value + "h";

// var dataUrl = "https://shielded-tundra-83707.herokuapp.com/nytweets";
// var dataUrl2 = "https://shielded-tundra-83707.herokuapp.com/nytweets2";
// var dataUrl3 = "https://shielded-tundra-83707.herokuapp.com/nytweets3/";
// var dataUrl4 = "https://shielded-tundra-83707.herokuapp.com/nytweets4/";
// var searchUrl = "https://shielded-tundra-83707.herokuapp.com/nytweets5/";

var dataUrl = "http://localhost:5000/nytweets";
var dataUrl2 = "http://localhost:5000/nytweets2";
var dataUrl3 = "http://localhost:5000/nytweets3/";
var dataUrl4 = "http://localhost:5000/nytweets4/";
var searchUrl = "http://localhost:5000/nytweets5/";

function getTweets(){
    tNewHash = [];
    $.ajax({
        url: dataUrl,
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            //console.log(data);
            newTweets(data);
            q1Times++;
            execUniq(tNewHash, tPreHash);
        },
        error: function() {
            console.log("WTF?");
        }
    });
};  


function getTweets2(){
    tPreHash = [];
    $.ajax({
        url: dataUrl2,
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            //console.log(data);
            preTweets(data);
            q2Times++;
            execUniq(tNewHash, tPreHash);
        },
        error: function() {
            console.log("WTF?");
        }
    });
};


function getTweets3(hash){
    $.ajax({
        url: dataUrl3.concat(hash),
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            hashDetail(data);
        },
        error: function() {
            console.log("WTF?");
        }
    });
}

function getTweets4(hash){
    hashTimes = 0;
    $.ajax({
        url: dataUrl4.concat(hash),
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            timeDetail(data);
            hashTimes++;
        },
        error: function() {
            console.log("WTF?");
        }
    });
}

getTweets();
getTweets2();
document.getElementById("poptitle").innerHTML = "Popular Hashtags of NYC";

//document.getElementById("searchQ").addEventListener("click", searchQuery());
function searchQ(){
    searchTurn = true;
    if(document.getElementById("keywordSearch").value){
        key=document.getElementById("keywordSearch").value;
    };
    if(document.getElementById("location").value){
        loc=document.getElementById("location").value;
    };
    document.getElementById("K").innerHTML = key;
    document.getElementById("L").innerHTML = loc;
    document.getElementById("D").innerHTML = dur;
    document.getElementById("poptitle").innerHTML = "Related Hashtags: ";
    uniqRound = 0;
};

setInterval(function(){
    if(searchTurn){
        getSearchTweet(key, loc, dur);
        // Get the <ul> element with id="myList"
        var list = document.getElementById("relateTweet");

        // If the <ul> element has any child nodes, remove its first child node
        if (list.hasChildNodes()) {
            list.removeChild(list.childNodes[0]);
        }
    } else {
        if (q1Times==q2Times) {
            getTweets();
            getTweets2();
        }
    }
}, 10*1000);

function getSearchTweet(key, loc, dur){
    $.ajax({
        url: searchUrl.concat(key + "/" + dur),
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            searchResults(data);
        },
        error: function() {
            console.log("WTF?");
        }
    });
}

function searchTweetDetail(hash){
    $.ajax({
        url: dataUrl3.concat(hash),
        header : "Access-control-allow-origin:*",
        type: "GET",
        dataType: 'JSON',
        success: function(data){ 
            searchDetail(data);
        },
        error: function() {
            console.log("WTF?");
        }
    });
}





