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

        // create a document map to map document IDs to titles.
        this.docMap = {};

        // create a word map to assign a numeric id to each term.
        this.wordMap = {};

        this.wordCount = 0;

        // minimum lenth a word has to be.
        this.minLength = args.minLength || 2;

        this.maxLength = args.maxLength || 30;

        this.stopWords = args.stopWords || [];
        
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

                        self.docMap[index.toString()] = val;

                        var path = self.inputDir + '/' + val;

                        //declare a callback function for readfile.
                        var callback = function (err, data) {

                            if (err) { self.emit('error', err); }
                            else {
                                //build an ojbect with the data and title
                                var doc = {'title': title,
                                    'id': index.toString(),
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
            
            //var title = doc.title || '_untitled_document';
            var id = doc.id;
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

            var self = this;

            parts.forEach(function(val, i, arr) {
                
                //clean the value by trimming off the empty spaces. 
                var word = val.trim().toLowerCase();
                
                /*
                 *check that the word is valid and that it does not
                 *contain any special characters.
                 */
                if(word.length > self.minLength && word.length <= self.maxLength
                    && Indexer.prototype.termValid(word)
                && self.stopWords.indexOf(word) == -1
                    && isNaN(word)) {

                    /*
                     *check if the word exists in the index.
                     */ 
                    if (index.hasOwnProperty(word)) {

                        /*
                         *check if the current document title is in the index.
                         *if so, push the index into the pos array. 
                         */
                        var record = index[word];

                        if (record.hasOwnProperty(id)) {

                            index[word][id].pos.push(i);

                            return; 
                            
                        }  else if( !record.hasOwnProperty(id)){

                            var key = index[word];

                            delete index[word];

                            key[id] = {pos: [i]};


                            index[word] = key;

                            //index[word][title] = {pos: [i]};

                            //increment the word count in the map by 1.
                            self.wordMap[word].count ++;

                            return;
                        }
                    }
                    
                    /*
                     *if the document title does not exist
                     *create an object with a pos as key and an Array as value that will hold the
                     *current index.
                     */
                    var pair = {};

                    pair[id] = {pos: [i]};

                    index[word] = pair;


                    //check if the wordMap contains the current term.
                    if(!self.wordMap.hasOwnProperty(word)) {
                        //if not, create an object with the current term and a unique numeric id. \
                        //increment the wordCount.
                        self.wordCount ++;

                        //create an object that stores the document ID along with an occurance count
                        //for the current term.
                        self.wordMap[word] = {id:self.wordCount,
                            count: 1};
                    }

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
                // return an object with the index and the id map
                this.emit('finish', {'index':this.index,
                                    'docMap': this.docMap,
                                    'wordMap': this.wordMap});
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


            // ______________TEMP FIX______________________________
            //check if the word starts with wg if so, return false/
            //wikipedia uses placeholder words that start with 'wg',
            if(str.length > 2 && str.charAt(0) == 'w' && str.charAt(1) == 'g') {

                return false;
            }
            //-----------------------------------------------------

            return !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    };
    
    return new Indexer(args); 
}

module.exports = create; 