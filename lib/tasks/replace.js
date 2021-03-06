var utils = require('../utils'),
    file = require('../utils/file'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');


exports.summary = 'Replace the contents of files';

exports.usage = '<source> [options]';

exports.options = {
    "d" : {
        alias : 'dest'
        ,default : '<source>'
        ,describe : 'destination directory or file'
    },

    "s" : {
        alias : 'search'
        ,describe : 'search string'
    },

    "r" : {
        alias : 'replace'
        ,describe : 'replace string'
    },

    "f" : {
        alias : 'flags'
        ,default : 'gm'
        ,describe : 'flags'
    },

    "c" : {
        alias : 'charset'
        ,default : 'utf-8'
        ,describe : 'file encoding type'
    }
};


exports.run = function (options, callback) {

    //console.log(args.argv);
    var source = options.source,
        dest = options.dest,
        replace = options.replace,
        search = options.search,
        charset = options.charset,
        flags = options.flags;


    try {

        file.globSync(source).forEach(function(inputFile){

            var outputFile = inputFile;

            // console.log(dest, file.isDirFormat(dest));

            if(file.isDirFormat(dest)){
                outputFile = path.join(dest , path.basename(outputFile) );
            }else{
                outputFile = dest;
            }

            task(inputFile, outputFile, search, replace, charset, flags);

        });

        callback()

    }catch (err){
        return callback(err);
    }

};


var task = exports.task = function(inputFile, outputFile, search, replace, charset, flags){

    charset = charset || "utf-8";
    flags = flags || "gm"; //global  multiline ignoreCase
    outputFile = outputFile || inputFile;

    if(_.isString(search)){
        search = new RegExp(search,flags);
    }

    var input = fs.readFileSync(inputFile, charset);
    //var input = fs.readFileSync(inputFile).toString();
    var output = input.replace(search, replace);

    // have replaced
    if(input != output){
        exports.log(inputFile, ">", outputFile, "replaced");
    }else{
    // no replaced
        exports.log(inputFile, ">", outputFile, "no replaced");
    }

    fs.writeFileSync(outputFile, output, charset);
    //fs.writeFileSync(outputFile, output);

};
