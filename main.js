var indexerFactory = require('./indexer.js'), 
    args = {'inputDir': './cache',
                'outputDir': './index' };
                
var indexer = indexerFactory(args).process(); 
                
