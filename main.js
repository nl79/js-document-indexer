var indexerFactory = require('./indexer.js'),
    fs = require('fs'),
    args = {'inputDir': './cache',
                'outputDir': './index',
    'minLength': 2,
    'stopWords': ['a', 'an', 'of', 'and', 'the', 'as', 'be', 'at','by','in']};

/*method to parse the index data object and record the results. */
var callback = function (data) {


    if(data.docMap) {
        console.log("Generating Document (ID => Title) Map");

        fs.writeFileSync("./docMap.txt", JSON.stringify(data.docMap, null, 4));

        console.log("Document Map Generated");
    }

    if(data.wordMap) {
        console.log("Generating Word (ID => Word) Map");

        fs.writeFileSync("./wordMap.txt", JSON.stringify(data.docMap, null, 4));

        console.log("Word Map Generated");
    }


    if(data.index) {


        console.log('Generating Index');

        for(term in data.index) {

            if(!data.index.hasOwnProperty(term)) { continue; }

            /*check if the term is a numeric value if so skip it.
            * temporary for limiting the index file size.
            */

            if(!isNaN(term)) { continue; }

            var str = term;

            var docs = data.index[term];

            console.log("Indexing Term = '" +term + "'");

            for(doc in docs) {
                if (docs.hasOwnProperty(doc)) {

                    var pos = docs[doc].pos;

                    if(pos instanceof Array) {

                        str += '\n\t' + doc + " - [" + pos.join(',') + ']';
                        
                    }
                }

            }

            str += '\n\n';

            fs.appendFileSync('./index.txt', str);

        }

        console.log("Index Generated");
    }

//console.log(data['the']);

}
var indexer = indexerFactory(args).on('finish', function(index) {
    console.log('Finished');
    callback(index);

}).process(); 
                
