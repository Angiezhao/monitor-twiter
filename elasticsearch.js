var elasticsearch = require('elasticsearch');
var date = new Date();
var month = '0' + parseInt(date.getMonth() + 1);
var year = date.getFullYear();
var elasticUrl = 'twitter-' + year + "." + month;
var hostUrl = 'http://user:8Tp138GMxi@vgc.poly.edu/projects/es-gateway/' + elasticUrl;
var elasticClient = new elasticsearch.Client({
  host: hostUrl
  // log: 'trace'
});
console.log(hostUrl);

function getNewYorkTweets(query) {
    return elasticClient.search(query);
}
exports.getNewYorkTweets = getNewYorkTweets;

