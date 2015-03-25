"use strict";
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
        //this.index = Object.create(null);
        this.index = {};
        
        //processed document acount
        this.processed = 0;
        
        //collection count.
        this.documentCount = 0;

        this.process = function() {
            var collection = null;

            var self = this;

            fs.readdir(this.inputDir, function(err, files) {
                if (err) { self.emit('error', err); }
                else {

                    /*
                     *set the files length in the documentCount property.
                     */
                    self.documentCount = files.length;


                    files.forEach(function(val,index,arr) {

                        //create the title and path variables and set the title to the
                        //current file name.
                        var title = val;
                        var path = self.inputDir + '/' + val;

                        //declare a callback function for readfile.
                        var callback = function (err, data) {

                            if (err) { self.emit('error', err); }
                            else {
                                //build an ojbect with the data and title
                                var doc = {'title': title,
                                    'data':data};

                                //call the index method.
                                self.buildIndex(doc);

                            }
                        };

                        // Read the file data.
                        fs.readFile(path, 'utf8', callback);

                    });
                }
            });
        }
        
        /*
         *@method getIndex() - return the index object.
         *@return Object - the index object.
         */
        
        this.getIndex = function() {
            return this.index; 
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
            
            if (!doc.data || typeof doc.data != 'string') {
                //emit an error event.
                this.emit('error', Error('buildIndex() - Invalid data supplied'));
                return; 
            }
            
            /*
             *validate that a document title was supplied.
             *if not, set to a default title.
             */
            
            var title = doc.title || '_untitled_document';
            
            console.log("Indexing: " + title); 
            
            /*
             *Remove the markup characters
             *Remove the none ascii characters
             *Split on 1 or more blank spaces characters. 
             */
            
            var parts = Indexer.prototype.stripMarkup(doc.data).replace(/\W/g, ' ').split(/\s+/); 
            //var self = this;

            var index = this.index;
            
            /*
             *loop over the array and validate each word.
             */
            parts.forEach(function(val, i, arr) {
                
                //clean the value by trimming off the empty spaces. 
                var word = val.trim().toLowerCase();
                
                /*
                 *check that the word is valid and that it does not
                 *contain any special characters.
                 */
                if(Indexer.prototype.termValid(word)) {
                    
                    
                    /*
                     *check if the word exists in the index.
                     */ 
                    if (index.hasOwnProperty(word)) {

                        /*
                         *check if the current document title is in the index.
                         *if so, push the index into the pos array. 
                         */
                        var record = index[word];

                        if (record.hasOwnProperty(title)) {

                            index[word][title].pos.push(i);

                            return; 
                            
                        }  else if( !record.hasOwnProperty(title)){

                            var key = index[word];

                            delete index[word];

                            key[title] = {pos: [i]};


                            index[word] = key;

                            //index[word][title] = {pos: [i]};

                            return;
                        }
                    }
                    
                    /*
                     *if the document title does not exist
                     *create an object with a pos as key and an Array as value that will hold the
                     *current index.
                     */
                    var pair = {};

                    pair[title] = {pos: [i]};

                    index[word] = pair;

                    return;

                }
                    
            });
            //increment the processed count
            this.processed += 1; 
            
            /*
             *check the processed and the documentCount
             *if processed is greater then or equal to the
             *documentCount, emit a 'finish' event.
             */
            if (this.processed >= this.documentCount) {
                this.emit('finish', this.index); 
            }
        }
             
    }
    
    /*
     *inherit the event mitter in order to
     *provite for events.
     */ 
    util.inherits(Indexer, emitter);
    
    /*
    *@method stripMarkup - removes special formatting characters from the document.
    */ 
    Indexer.prototype.stripMarkup = function (str){
            var rex = /(<([^>]+)>)/ig;
            return str.replace(rex , "");    
    }
    
    /*
    *@method isValid - determines if a word contains any special characters.
    */ 
    Indexer.prototype.termValid = function(str){
            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };
    
    return new Indexer(args); 
}

module.exports = create; 