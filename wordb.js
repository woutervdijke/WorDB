var wordToSearch = 'enterHERE'; //enter here which word to reference in the hash table


/* below here is the code to make it work */
var fs = require('fs'); // File System is required to read the collection file
var sugar = require('sugar'); // Sugar enables the .count() method
var _ = require('underscore'); // Underscore enables .isEmpty
var plotly = require('plotly')("woutervdijke", "uldyoki8fg"); // Plotly creates the histogram

var collection = fs.readFileSync('collection.txt').toString(); //read the collection file
collection = collection.replace(/(\r\n|\n|\r)|<\/p>|<p>|\(|\)|'|"|,|:|\.|\?/gm, "").toLowerCase(); //pre-process to remove interpunction, line breaks and uppercase letters.

var articles = collection.split('</doc>'); // split the collection file into the different articles
var articleCount = articles.length-1; // for some reason articles.length is 1 higher than the actual number of articles
var articleArray = [];

// put all articles in an array and split the articles into lists of words
for (var i=0; i < articleCount; i++) {
	articleArray[i] = [articles[i].substring(articles[i].search('<docid>')+7, articles[i].search('</docid>')), articles[i].substring(articles[i].search('<text>')+6, articles[i].search('</text>'))];
	articleArray[i][1] = articleArray[i][1].split(' ').sort();
}

// put the word count and docid for each word in the array
for (var x=0; x < articleCount; x++) {
	articleArray[x][2] = [];
	articleArray[x][3] = [];
	for (var y=0; y < articleArray[x][1].length; y++) {
		articleArray[x][2][y] = articleArray[x][1].count(articleArray[x][1][y]);
		articleArray[x][3][y] = articleArray[x][0];
		}
	}

var wordlist = {}; // create an empty object to contain the wordlist

//put each word in the wordlist with the count and docid as values
for (var x=0; x < articleCount; x++) {
	for (var y=0; y < articleArray[x][1].length; y++) {
			wordlist[articleArray[x][1][y]+x] = {doc: x+1, count: articleArray[x][2][y]};
	}
}

console.log('  Word to search: ' + wordToSearch);
for (var x=0; x < articleCount; x++) {
	if (_.isUndefined(wordlist[wordToSearch+x]) == false) {  // if-statement filters so it only returns documents where the word is found
		console.log(wordlist[wordToSearch + x]);
	}
}


/* below here, the histogram is generated */

var allArticles = [];

for (var x=0; x < articleCount; x++) { // push all articles into one array
	allArticles.push(articleArray[x][1]);
}

for (var x=1; x < articleCount; x++) { // push all words together in the array
	for (var y=0; y < articleArray[x][1].length; y++) {
		allArticles[0].push(articleArray[x][1][y]);
	}
	allArticles[x] = [];
}

allArticles[0] = allArticles[0].sort();

// put the word count for each word in the array
allArticles[1] = [];
for (var y=0; y < allArticles[0].length; y++) {
		allArticles[1][y] = allArticles[0].count(allArticles[0][y]);
	}

var wordcountlist = {}; // create an empty object to contain the wordlist

//put each word in the wordcountlist  as object with the count as value
for (var y=0; y < allArticles[0].length; y++) {
		wordcountlist[allArticles[0][y]] = {count: allArticles[1][y]};
}

var allWordcounts = Object.keys(wordcountlist).map(k => wordcountlist[k].count); // take the wordcounts out of the wordcountlist and put them in an array


var data = [
	{
		x: allWordcounts,
		type: "histogram"
	}
];
var graphOptions = {filename: "basic-histogram", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
	console.log("Plotly plot:");
	console.log(msg);
});