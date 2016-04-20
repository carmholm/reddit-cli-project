var request = require('request');
var util = require("util");

var inquirer = require('inquirer');

var menuChoices = [{
  name: 'Show homepage',
  value: 'HOMEPAGE'
}, {
  name: 'Show subreddit',
  value: 'SUBREDDIT'
}, {
  name: 'List subreddits',
  value: 'SUBREDDITS'
}];

function myApp() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  }).then(
    function(answers) {
      if (answers.menu === "HOMEPAGE") {
        var homepageObj = {
          post: {
            title: [], 
            url: []
            },
        };
        getHomepage(function(res) {
          res.forEach(function(x, i){
            homepageObj.post.title.push(x.data.title.substr(0,60) + "...");
            homepageObj.post.url.push(x.data.url);
          });
          console.log(homepageObj);
        });
      }
    }
  );
}

myApp();


/*
This function should "return" the default homepage posts as an array of objects
*/

function getHomepage(callback) {
  var address = "http://www.reddit.com/.json";
  request(address, function(err, result) {
    var resultObject = JSON.parse(result.body);
    var resultArray = resultObject.data.children;
    callback(resultArray);
    // Load reddit.com/.json and call back with the array of posts
  });
}


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
    var addressSort = address + sortingMethod + ".json";
    request(addressSort, function(err, result) {
      var resultObject = JSON.parse(result.body);
      var resultArray = resultObject.data.children
      callback(resultArray);
    });
  }
}

// getSortedHomepage("new", function(x){
// console.log(util.inspect(x, { showHidden: true, depth: 1, colors: true }));
// });


/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  var address = "http://www.reddit.com/r/";
  var addressSubreddit = address + subreddit + ".json";

  request(addressSubreddit, function(err, result) {
    var resultObject = JSON.parse(result.body);
    var resultArray = resultObject.data.children;
    callback(resultArray);
  });
}

// getSubreddit("funny", function(x){
// console.log(util.inspect(x, { showHidden: true, depth: 1, colors: true }));
// });

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  var redditSortingMethods = ["hot", "new", "rising", "controversial", "top", "gilded", "wiki", "promoted"];

  if (redditSortingMethods.indexOf(sortingMethod) !== -1) {
    var address = "http://www.reddit.com/r/";
    var newAddress = address + subreddit + "/" + sortingMethod + ".json";
    request(newAddress, function(err, result) {
      var resultObject = JSON.parse(result.body);
      var resultArray = resultObject.data.children;
      callback(resultArray);
    });
  }
}

// getSortedSubreddit("funny", "new", function(x){
// console.log(util.inspect(x, { showHidden: true, depth: 1, colors: true }));
// });

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
  var address = "http://www.reddit.com/subreddits.json";
  request(address, function(err, result) {
    var resultObject = JSON.parse(result.body);
    var resultArray = resultObject.data.children;
    callback(resultArray);
  });
}

// getSubreddits(function(x){
// console.log(util.inspect(x, { showHidden: true, depth: 1, colors: true }));
// });


// Export the API
module.exports = {
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSubreddit: getSubreddit,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits
    // ...
};
