var request = require('request');
var util = require("util");

//console.log(util.inspect(x, { showHidden: true, depth: null, colors: true })


/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
  var address = "http://www.reddit.com/.json";
  request(address, function(err, result) {
    callback(JSON.parse(result.body));
    // Load reddit.com/.json and call back with the array of posts
  });
}

// getHomepage(function(x){
// console.log(util.inspect(x.data.children, { showHidden: true, depth: 1, colors: true }));
// });

/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  var address = "http://www.reddit.com/";
  var redditSortingMethods = ["hot", "new", "rising", "controversial", "top", "gilded", "wiki", "promoted"];

  if (redditSortingMethods.indexOf(sortingMethod) !== -1) {
    var addressSort = address + sortingMethod + "/.json";
    request(addressSort, function(err, result) {
      callback(JSON.parse(result.body));
    });
  }
}

getSortedHomepage("old", function(x){
console.log(util.inspect(x.data.children, { showHidden: true, depth: 1, colors: true }));
});


/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
}

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
}

// Export the API
module.exports = {
  // ...
};
