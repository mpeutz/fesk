#!/usr/bin/env node

// Local generation of node package: http://podefr.tumblr.com/post/30488475488/locally-test-your-npm-modules-without-publishing
// npm pack
// npm install C:/Users/mpeutz/Documents/Github/fesk/fesk-0.1.0.tgz

var fs          = require( "fs" ),
    cpr         = require( "cpr" ).cpr,
    mkdirp      = require( "mkdirp" ),
    path        = require( "path" ),
    postcss     = require( "postcss" ),
    cssnext     = require( "cssnext" ),
    sourceStyle = path.join(process.cwd() , "node_modules/fesk/styleguide" ),
    destStyle   = path.join(process.cwd() , "styleguide" ),
    sourceCSS   = path.join(process.cwd() , "css/partials/styles.css" ),
    destCSS     = path.join(process.cwd() , "css/styles.css" ),
    docSource   = path.join(process.cwd() , "node_modules/fesk/docs/gudieline.md");

var argv        = require( "yargs" )
                  .argv;

if (argv.help || argv.h) {
    console.log('FESK Help');
    console.log('fesk    : runs styleguide generator');
    console.log('fesk -u : updates version [num] "[Comment]"');
    console.log('fesk -i : initializes fesk and copies over styleguide files ');
    console.log('fesk -c : copies over base content files');
    console.log('fesk -d : add your own doc file');
    console.log('fesk -h : help');
    return;
}

if (argv.init || argv.i) {
    console.log('Lets initialize this mother');

    cpr(
        sourceStyle,
        destStyle,
        {
            overwrite: false,
            confirm: true
        },
        function (err) { if (err) {return console.log('Woah, cool your jets pound cake, looks like something went awry.');}
        });
    console.log('Hoozah! the styleguide stuff has been generated');
}

if (argv.content || argv.c) {
    cpr(
        path.join(process.cwd() ,  'node_modules/fesk/dev'),
        process.cwd(),
        {
            overwrite: false,
            confirm: true
        },
        function (err) {if (err) {return console.log('Woah, cool your jets pound cake, looks like something went awry.');}
        console.log('Righty-oh! The dev files have been dropped into the main folder.');
        });
}



if (fs.existsSync(sourceCSS)) {

    // Get css file to parse into styleguide, if it doesn't exist make one.
    var input = fs.readFileSync( sourceCSS, 'utf-8' );
    var getDirName = require("path").dirname;
    function writeFile (path, contents, cb) {
        mkdirp(getDirName(path), function (err) {
            if (err) return cb(err);
            fs.writeFile(path, contents, cb);
        });
    }
    console.log('start parsing css file' + sourceCSS);
    // Parse css into styleguide
    var root        = postcss.parse(input),
        styleGuide  = require(path.join(process.cwd() , "styleguide/plugins/styleguide.js"));




    var output = postcss()
        .use( cssnext() )
        .use( styleGuide() )
        .process( input, {
            from: sourceCSS
        } );


    writeFile( destCSS , output , function() {

        var stats = fs.statSync( destCSS );
        var statName = path.join(process.cwd() , 'styleguide/json/statGuide.json');
        var helperCSS = path.join(process.cwd() , 'styleguide/css/helperStyles.css');
        var stat = require(statName);

        stat.unshift({fileSize: stats.size / 1000.0 + ' KBs', published: stats.mtime});
        fs.writeFile(statName, JSON.stringify(stat, null,4));

        var styles = postcss.parse(output);
        var  pseudos, replaceRule;
        var selectors = [];
        pseudos = /(\:hover|\:disabled|\:active|\:visited|\:focus)/g;
        styles.eachRule(function (rule) {
            if (pseudos.test(rule)) {
                replaceRule = function(matched, stuff) {
                  return ".pseudo-class-" + matched.replace(':', '');
                };
                var rules = rule.toString().replace(pseudos, replaceRule);
                selectors.push(rules);
            }
        });


        fs.writeFile(helperCSS, selectors.toString().replace(/\},/g, '}') );

        return console.warn('OMG! its done!!');
    });
} else {
    return console.log('Please add a style.css file to the css/partials folder.');
}

if (argv.update || argv.u) {
        var logName = path.join(process.cwd() , '/styleguide/json/changeLog.json');
        var log = require(logName);
        log.unshift({version: argv.u , comment: argv._.toString() , date: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')});
        fs.writeFile(logName, JSON.stringify(log, null,4));
}