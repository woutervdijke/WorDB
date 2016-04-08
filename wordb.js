var fs = require('fs');
var sugar = require('sugar');

var collection = fs.readFileSync('collection.txt').toString(); //read the collection file
collection = collection.replace(/(\r\n|\n|\r)|<\/p>|<p>|\(|\)|'|"|\.|\?/gm, "").toLowerCase(); //pre-process to remove interpunction, line breaks and uppercase letters.

var articles = collection.split('</doc>');
var articleCount = articles.length-1;
var articleArray = [];

for (var i=0; i < articleCount; i++) {
	articleArray[i] = [articles[i].substring(articles[i].search('<docid>')+7, articles[i].search('</docid>')), articles[i].substring(articles[i].search('<text>')+6, articles[i].search('</text>'))];
	}

for (var w=0; w < articleCount; w++) {
	 articleArray[w][1] = articleArray[w][1].split(' ').sort();}


for (var x=0; x < articleCount; x++) {
	articleArray[x][2] = [];
	for (var y=0; y < articleArray[x][1].length; y++) {
			articleArray[x][2][y] = articleArray[x][1].count(articleArray[x][1][y]);
		}
	}

console.log(articleArray[1][2]);

//todo create object from wordlist
