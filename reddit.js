const imageToAscii = require("image-to-ascii");
var prompt = require('prompt');
var request = require('request');
var colors = require('colors');
var wrap = require('word-wrap');
var util = require("util");
prompt.start();

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

var sortingMethods = [{
  name: 'Hot',
  value: 'HOT'
}, {
  name: 'New',
  value: 'NEW'
}, {
  name: 'Rising',
  value: 'RISING'
}, {
  name: 'Controversial',
  value: 'CONTROVERSIAL'
}, {
  name: 'Top',
  value: 'TOP'
}, {
  name: 'Gilded',
  value: 'GILDED'
}, {
  name: 'Wiki',
  value: 'WIKI'
}, {
  name: 'Promoted',
  value: 'PROMOTED'
}];




function myApp() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  }).then(function(answers) {
    if (answers.menu === "HOMEPAGE") {
      var homepageObj = [];
      getHomepage(function(arr) {
        arr.forEach(function(x, i) {
          homepageObj.push({
            name: x.data.title,
            value: x.data
          });
        });
        homepageObj.unshift(new inquirer.Separator(), 'SORT POSTS', new inquirer.Separator());
        inquirer.prompt({
          type: 'list',
          name: 'menu',
          message: "What would you like to see?",
          choices: homepageObj
        }).then(function(answer) {
          var reddit = answer.menu;
          if (answer.menu === "SORT POSTS") {
            inquirer.prompt({
              type: 'list',
              name: 'menu',
              message: 'Please choose a sorting method:',
              choices: sortingMethods
            }).then(function(answer) {
              var sortingMethod = answer.menu;
              var sortedObj = [];
              getSortedHomepage(sortingMethod, function(resultArray) {
                resultArray.forEach(function(x, i) {
                  sortedObj.push({
                    name: x.data.title,
                    value: x.data
                  });
                });
                sortedObj.unshift(new inquirer.Separator(), 'HOMEPAGE', new inquirer.Separator());
                inquirer.prompt({
                  type: 'list',
                  name: 'menu',
                  message: "What would you like to see?",
                  choices: sortedObj
                }).then(function(answer) {
                  var sortedItems = answer.menu;
                  if (answer.menu === "HOMEPAGE") {
                    myApp();
                  }
                  else {
                    console.log("Title".underline.bold + ": " + sortedItems.title);
                    console.log("Url".underline.bold + ": " + sortedItems.url.blue);
                    console.log("Author".underline.bold + ": " + sortedItems.author);
                    console.log("Views".underline.bold + ": " + sortedItems.score);
                    if (sortedItems.thumbnail.indexOf('png', 'img', 'gif')) {
                      imageToAscii(sortedItems.thumbnail, (err, converted) => {
                        console.log(err || converted);
                        getComments(sortedItems, function(commentsArray) {
                          console.log(commentsArray);
                          myApp();
                        });
                      });
                    }
                  }
                });
              });
            });
          }
          else {
            console.log("Title".underline.bold + ": " + reddit.title);
            console.log("Url".underline.bold + ": " + reddit.url.blue);
            console.log("Author".underline.bold + ": " + reddit.author);
            console.log("Views".underline.bold + ": " + reddit.score);
            if (reddit.thumbnail.indexOf('png', 'img', 'gif')) {
              imageToAscii(reddit.thumbnail, (err, converted) => {
                console.log(err || converted);
                getComments(reddit, function(commentsArray) {
                  console.log(commentsArray);
                  myApp();
                });
              });
            }
          }
        });
      });
    }
    else if (answers.menu === "SUBREDDIT") {
      prompt.get(['subreddit'], function(err, result) {
        var subreddit = result.subreddit;
        var subredditObj = [];
        getSubreddit(subreddit, function(arr) {
          arr.forEach(function(x, i) {
            subredditObj.push({
              name: x.data.title,
              value: x.data
            });
          });
          inquirer.prompt({
            type: 'list',
            name: 'menu',
            message: 'What would you like to see?',
            choices: subredditObj
          }).then(function(answer) {
            var subredditItem = answer.menu;
            console.log("Title".underline.bold + ": " + subredditItem.title);
            console.log("Url".underline.bold + ": " + subredditItem.url.blue);
            console.log("Author".underline.bold + ": " + subredditItem.author);
            console.log("Views".underline.bold + ": " + subredditItem.score);
            if (subredditItem.thumbnail.indexOf('png', 'img', 'gif')) {
              imageToAscii(subredditItem.thumbnail, (err, converted) => {
                console.log(err || converted);
                getComments(subredditItem, function(commentsArray) {
                  console.log(commentsArray);
                  myApp();
                });
              });
            }
          });
        });
      });
    }
    else if (answers.menu === "SUBREDDITS") {
      var subredditsObj = [];
      getSubreddits(function(arr) {
        arr.forEach(function(x, i) {
          subredditsObj.push({
            name: x.data.display_name,
            value: x.data.display_name
          });
        });
        subredditsObj.unshift(new inquirer.Separator(), 'HOMEPAGE', new inquirer.Separator());
        inquirer.prompt({
          type: 'list',
          name: 'menu',
          message: 'Choose a subreddit',
          choices: subredditsObj
        }).then(function(answer) {
          var subredditChoice = answer.menu;
          var newSubredditObj = [];
          if (answer.menu === "HOMEPAGE") {
            myApp();
          }
          else {
            getSubreddit(subredditChoice, function(arr) {
              arr.forEach(function(x, i) {
                newSubredditObj.push({
                  name: x.data.title,
                  value: x.data
                });
              });

              inquirer.prompt({
                type: 'list',
                name: 'menu',
                message: 'What would you like to see?',
                choices: newSubredditObj
              }).then(function(answer) {
                var subredditItem = answer.menu;
                console.log("Title".underline.bold + ": " + subredditItem.title);
                console.log("Url".underline.bold + ": " + subredditItem.url.blue);
                console.log("Author".underline.bold + ": " + subredditItem.author);
                console.log("Views".underline.bold + ": " + subredditItem.score);
                if (subredditItem.thumbnail.indexOf('png', 'img', 'gif')) {
                  imageToAscii(subredditItem.thumbnail, (err, converted) => {
                    console.log(err || converted);
                    getComments(subredditItem, function(commentsArray) {
                      console.log(commentsArray);
                      myApp();
                    });
                  });
                }
              });
            });
          }
        });
      });
    }

  });
}

myApp();

function getComments(redditArr, callback) {
  var redditCommentURL = "https://www.reddit.com" + redditArr.permalink + ".json";
  request(redditCommentURL, function(err, result) {
    var resultArray = JSON.parse(result.body);
    var commentObj = resultArray[1].data.children;
    var commentsArr = [];
    commentObj.forEach(function(x, i) {
      commentsArr.push({
        comment: x.data.body
      });
    });
    callback(commentsArr);
  });
}


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

// Load reddit.com/{sortingMethod}.json and call back with the array of posts
// Check if the sorting method is valid based on the various Reddit sorting methods

function getSortedHomepage(sortingMethod, callback) {
  var redditSort = "http://www.reddit.com/" + sortingMethod.toLowerCase() + ".json";
  request(redditSort, function(err, result) {
    var resultObject = JSON.parse(result.body);
    var resultArray = resultObject.data.children;
    callback(resultArray);
  });
}



// function getSortedHomepage(sortingMethod, callback) {
//   var address = "http://www.reddit.com/";
//   var redditSortingMethods = ["hot", "new", "rising", "controversial", "top", "gilded", "wiki", "promoted"];
//   if (redditSortingMethods.indexOf(sortingMethod) !== -1) {
//     var addressSort = address + sortingMethod + ".json";
//     request(addressSort, function(err, result) {
//       var resultObject = JSON.parse(result.body);
//       var resultArray = resultObject.data.children
//       callback(resultArray);
//     });
//   }
// }

// getSortedHomepage("new", function(x){
// console.log(util.inspect(x, { showHidden: true, depth: 1, colors: true }));
// });


/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  var address = "http://www.reddit.com/r/";
  var addressSubreddit = address + subreddit + "/.json";
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
