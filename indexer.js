var
    emitter = require('events').EventEmitter,
    util = require("util"), 
    fs = require('fs'); 



function create (args) {
    
    function Indexer(args) {
        
        //document cache directory. 
        this.inputDir = args && args.inputDir || '';
        //index output directory.
        this.outputDir = args && args.outputdir || '/_default_output';
        
        //create an empty index object. 
        this.index = Object.create(null); 
        
        
        this.process = function() {
            
        }
        
    }
    
    
    /*
     *@method isValid - determines if a word contains any special characters.
     */ 
    Indexer.prototype.termValid = function(str){
            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };
    
    /*
     *@method stripMarkup - removes special formatting characters from the document.
     */ 
    Indexer.prototype.stripMarkup = function (str){
            var rex = /(<([^>]+)>)/ig;
            return str.replace(rex , "");    
    }
    
    /*
     *inherit the event mitter in order to
     *provite for events.
     */ 
    util.inherits(Indexer, emitter);
    
    return new Indexer(args); 
}

module.exports = create; 