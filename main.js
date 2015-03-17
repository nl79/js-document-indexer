var indexerFactory = require('./indexer.js'), 
    args = {'inputDir': './test_data',
                'outputDir': './index' };
                
var indexer = indexerFactory(args).on('finish', function(index) {
    console.log('Finished');
}).process(); 
                
