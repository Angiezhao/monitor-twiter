var express = require('express')
var router = express.Router()

var elastic = require('./elasticsearch');

var date = new Date();
var month = '0' + parseInt(date.getMonth() + 1);
var year = date.getFullYear();
var elasticUrl = "twitter-" + year + "." + month;

var twelveHoursTweets = {
  _index: elasticUrl,
  _type: "tweet",
  body: {
    query: {
      filtered: {
        query: {
          constant_score : {
            filter : {
                terms : { "place.name" : ["brooklyn", "queens", "bronx", "manhattan"]}
            }
          }
        },
        filter: {
          and: [
            {
              range: {
                "@timestamp": {
                  from: "now-24h",
                  to: "now"
                }
              }
            },
            {
              and: [
                {
                  exists: { "field": "coordinates"}
                },
                {
                  exists: { "field": "entities.hashtags.text"} 
                }
              ]
              //exists: { "field": "entities.hashtags.text"} 
            }
          ]
        }
      }
    },
    aggs : {
      hashtags : {
        terms: { 
          field : "entities.hashtags.text",
          size: 70
        }
      }
    }
  }
};

var lastMonthTweets = {
  _index: elasticUrl,
  _type: "tweet",
  body: {
    query: {
      filtered: {
        query: {
          constant_score : {
              filter : {
                  terms : { "place.name" : ["brooklyn", "queens", "bronx", "manhattan"]}
              }
          }
        },
        filter: {
          and: [
            {
              range: {
                "@timestamp": {
                  from: "now-48h",
                  to: "now-24h"
                }
              }
            },
            {
              and: [
                {
                  exists: { "field": "coordinates"}
                },
                {
                  exists: { "field": "entities.hashtags.text"} 
                }
              ] 
              //exists: { "field": "entities.hashtags.text"} 
            }
          ]
        }
      }
    },
    aggs : {
      hashtags : {
          terms: { 
            field : "entities.hashtags.text",
            size: 50
          }
      }
    }
  }
};

function getHashtag(hashtag) {
  return {
    _index: elasticUrl,
    _type: "tweet",
    body: {
      query: {
        filtered: {
          query: {
            constant_score : {
                filter : {
                    terms : { "place.name" : ["brooklyn", "queens", "bronx", "manhattan"]}
                }
            }
          },
          filter: {
            and: [
              {
                range: {
                  "@timestamp": {
                    from: "now-24h",
                    to: "now"
                  }
                }
              },
              {
                and: [
                  {
                    exists: { "field": "coordinates"}
                  },
                  {
                    term:{"text": hashtag}
                    //prefix: {"entities.hashtags.text": hashtag} 
                  }
                ]
              }
            ]
          }
        }
      },
      size: 2000,
      sort: [
        {
          id: { "order" : "desc"}  
        }
      ],
      aggs:{
        tweets_per_hour:{
          date_histogram: {
            "field": "@timestamp",
            "interval": "hour"
          }
        },
        keyword:{
          significant_terms: {
            "field": "text",
            size: 12
          }
        }
      },
      highlight:{
        fields : {
          "text": {}
        }
      }
    }
  };
};

function searchQuery(key, loc, dur){
  return {
    _index: elasticUrl,
    _type: "tweet",
    body: {
      query: {
        filtered: {
          query: {
            multi_match: {
              query: key,
              fields: ["text", "entities.hashtags.text", "user.screen_name"],
              operator: "or"
            }
          },
          filter: {
            and: [
              {
                range: {
                  "@timestamp": {
                    from: dur,
                    to: "now"
                  }
                }
              },
              {
                constant_score : {
                    filter : {
                        terms : { "place.name" : ["brooklyn", "queens", "bronx", "manhattan"]}
                    }
                }
              }              
            ]
          }
        }
      },
      aggs : {
        hashtags : {
          significant_terms: { 
            field : "entities.hashtags.text",
            size: 10
          },
          aggs:{
            tweets_per_hour:{
              date_histogram: {
                "field": "@timestamp",
                "interval": "hour"
              }
            }
          }
        },
        keyword:{
          // significant_terms : { "field" : "text" }
          terms:{ "field" : "text" }
        }
      },
      highlight:{
        fields : {
          "text": {}
        }
      }
    }
  };
};

router.get('/nytweets', function (req, res, next) {
    elastic.getNewYorkTweets(twelveHoursTweets).then(function (result) {
        res.json(result);
    });
});

router.get('/nytweets2', function (req, res, next) {
    elastic.getNewYorkTweets(lastMonthTweets).then(function (result) {
        res.json(result);
    });
});

router.get('/nytweets3/:hashtag', function (req, res, next) {
    //console.log(JSON.stringify(getHashtag(req.params["hashtag"]), null, 10));
    elastic.getNewYorkTweets(getHashtag(req.params["hashtag"])).then(function (result) {
        res.json(result);
    });
});

router.get('/nytweets4/:hashtag', function (req, res, next) {
    //console.log(JSON.stringify(getHashtag(req.params["hashtag"]), null, 10));
    elastic.getNewYorkTweets(getHashtag(req.params["hashtag"])).then(function (result) {
        res.json(result);
    });
});

router.get('/nytweets5/:key/:dur', function (req, res, next) {
    //console.log(JSON.stringify(getHashtag(req.params["hashtag"]), null, 10));
    elastic.getNewYorkTweets(searchQuery(req.params["key"], null, req.params["dur"])).then(function (result) {
        res.json(result);
    });
});

module.exports = router;
