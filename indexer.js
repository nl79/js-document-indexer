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
        
        /*
         *@method buildIndex() - generate an index object for the supplied text data.
         *@param String - Document String. 
         */ 
        this.buildIndex = function(doc) {
            /*
             * Validate the data object
             * and check if its a string
             */
            
            if (!doc.data || typeof url != 'string') {
                //emit an error event.
                this.emit('error', Error('buildIndex() - Invalid data supplied'));
                return; 
            }
            
            /*
             *validate that a document title was supplied.
             *if not, set to a default title.
             */
            
            var title = doc.title || '_untitled_document'; 
            
            /*
             *remove special characters
             */
            
            /*
             *split on space.
             */
            
            /*
             *loop over the array and validate each word.
             */
            
            
        }
        
        
        this.isValid = function() {
            
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