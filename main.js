var indexerFactory = require('./indexer.js'),
    fs = require('fs'),
    args = {'inputDir': './cache',
                'outputDir': './index' };

/*method to parse the index data object and record the results. */
var callback = function (data) {

    if(data.index) {

        if(data.map) {
            console.log("Generating Document (ID => Title) Map");



            fs.writeFile("./map.txt", JSON.stringify(data.map, null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }

                console.log("Map Generated");
            });

        }

        console.log('Generating Index');

        for(term in data.index) {

            /*check if the term is a numeric value if so skip it.
            * temporary for limiting the index file size.
            */

            if(!isNaN(term)) { continue; }

            var str = term;


            var docs = data[term];

            console.log("Indexing Term = '" +term + "'");

            for(doc in docs) {
                str += '\n\t' + doc + " - [" + docs[doc].pos.join(',') + ']';

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
                
