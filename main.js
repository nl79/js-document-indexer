var indexerFactory = require('./indexer.js'),
    fs = require('fs'),
    args = {'inputDir': './test_data',
                'outputDir': './index' };

/*method to parse the index data object and record the results. */
var callback = function (data) {

    if(data) {
        console.log('Generating Index');
        for(term in data) {

            var str = term;

            var docs = data[term];

            for(doc in docs) {
                str += '\n\t' + doc + " - [" + docs[doc].pos.join(',') + ']' + '\n';
                console.log(str);
                //console.log(doc);
                //console.log(docs[doc].pos);
                fs.appendFileSync('./index.txt', str);
            }

        }

        console.log("Index Generated");
    }

//console.log(data['the']);

}
var indexer = indexerFactory(args).on('finish', function(index) {
    console.log('Finished');
    callback(index);

}).process(); 
                
