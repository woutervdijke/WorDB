var fs = require('fs');

var collection = fs.readFileSync('collection.txt').toString(); //read the collection file
collection = collection.replace(/(\r\n|\n|\r)|<\/p>|<p>|\(|\)|'|"|\.|\?/gm, "").toLowerCase(); //pre-process to remove interpunction, line breaks and uppercase letters.

var articles = collection.split('</doc>');
var articleCount = articles.length-1;
var articleArray = [];

for (var i=0; i < articleCount; i++) {
	articleArray[i] = [articles[i].substring(articles[i].search('<docid>')+7, articles[i].search('</docid>')), articles[i].substring(articles[i].search('<text>')+6, articles[i].search('</text>'))];
	}
	
var wordlist = [];
for (var w=0; w < articleCount; w++) {
	 wordlist[w] = articleArray[w][1].split(' ').sort();}

console.log(wordlist[1]);

//todo create object from wordlist

var wordcounts = {Australia:[[0,7][1,0][2,3]]};

