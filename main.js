var indexerFactory = require('./indexer.js'),
    fs = require('fs'),
    args = {'inputDir': './cache',
                'outputDir': './index' };

/*method to parse the index data object and record the results. */
var callback = function (data) {

    /*
    if(data.map) {
        console.log("Generating Document (ID => Title) Map");

        fs.writeFileSync("./map.txt", JSON.stringify(data.map, null, 4));

        console.log("Map Generated");

    }
    */

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
                
