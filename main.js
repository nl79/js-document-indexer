var indexerFactory = require('./indexer.js'), 
    args = {'inputDir': './cache',
                'outputDir': './index' };
                
var indexer = indexerFactory(args).on('finish', function(index) {
    console.log(index); 
}).process(); 
                
