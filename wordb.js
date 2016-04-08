var fs = require('fs'); // File System is required to read the collection file
var sugar = require('sugar'); // Sugar enables the .count() method
var _ = require('underscore'); // Underscore enables the .isEmpty() method
var prompt = require('prompt');

var collection = fs.readFileSync('collection.txt').toString(); //read the collection file
collection = collection.replace(/(\r\n|\n|\r)|<\/p>|<p>|\(|\)|'|"|,|:|\.|\?/gm, "").toLowerCase(); //pre-process to remove interpunction, line breaks and uppercase letters.

var articles = collection.split('</doc>'); // split the collection file into the different articles
var articleCount = articles.length-1; // for some reason articles.length is 1 higher than the actual number of articles
var articleArray = [];

// put all articles in an array
for (var i=0; i < articleCount; i++) {
	articleArray[i] = [articles[i].substring(articles[i].search('<docid>')+7, articles[i].search('</docid>')), articles[i].substring(articles[i].search('<text>')+6, articles[i].search('</text>'))];
	}

// split the articles into lists of words
for (var w=0; w < articleCount; w++) {
	 articleArray[w][1] = articleArray[w][1].split(' ').sort();}

// put the word count for each word in the array
for (var x=0; x < articleCount; x++) {
	articleArray[x][2] = [];
	for (var y=0; y < articleArray[x][1].length; y++) {
			articleArray[x][2][y] = articleArray[x][1].count(articleArray[x][1][y]);
		}
	}

// repeat the docid for each word in the array
for (var x=0; x < articleCount; x++) {
	articleArray[x][3] = [];
	for (var y=0; y < articleArray[x][1].length; y++) {
		articleArray[x][3][y] = articleArray[x][0];
	}
}

var wordlist = {}; // create an empty object to contain the wordlist

//put each word in the wordlist with the count and docid as values
for (var x=0; x < articleCount; x++) {
	for (var y=0; y < articleArray[x][1].length; y++) {
		if (_.isEmpty(wordlist[articleArray[x][1][y]])) {
			wordlist[articleArray[x][1][y]] = {count: articleArray[x][2][y], docid: articleArray[x][3][y]};
		} else {
			wordlist[articleArray[x][1][y]+x] = {count: articleArray[x][2][y], docid: articleArray[x][3][y]}
		}
	}
}
// the prompt part makes it a bit more
prompt.start();

prompt.get(['wordToSearch'], function (err, result) {
	if (err) { return onErr(err); }
	console.log('Command-line input received:');
	console.log('  Word to search: ' + result.wordToSearch);
	console.log(wordlist[result.wordToSearch]);
	for (var x=1; x < articleCount; x++) {
		console.log(wordlist[result.wordToSearch+x])
	}
});