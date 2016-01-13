#!/usr/bin/env node

// Local generation of node package: http://podefr.tumblr.com/post/30488475488/locally-test-your-npm-modules-without-publishing
// npm pack
// npm install C:/Users/mpeutz/Documents/Github/fesk/fesk-0.0.1.tgz

var fs          = require( "fs" ),
    cpr         = require( "cpr" ).cpr,
    mkdirp      = require( "mkdirp" ),
    path        = require( "path" ),
    inquirer    = require("inquirer"),
    postcss     = require( "postcss" ),
    cssnext     = require( "cssnext" ),
    sourceStyle = path.join(process.cwd() , "node_modules/fesk/styleguide" ),
    destStyle   = path.join(process.cwd() , "styleguide" ),
    sourceCSS   = path.join(process.cwd() , "css/partials/styles.css" ),
    destCSS     = path.join(process.cwd() , "css/styles.css" ),
    docSource   = path.join(process.cwd() , "node_modules/fesk/docs/gudieline.md");

var argv  = require( "yargs" )
            .option( "i", { alias: "initailize", demand: false, describe: "Initialize project"} )
            .option( "u", { alias: "update", demand: false, describe: "Update styleguide version" } )
            .option( "g", { alias: "guide", demand: false, describe: "Generate styleguide" } )
            .option( "t", { alias: "theme", demand: false, describe: "Generate theme colors for styleguide" } )
            .option( "p", { alias: "partial", demand: false, describe: "Add a partial file to main styles" } )
            .help( "?" )
            .alias( "?", "help" )
            .example( "fesk -i", "Follow prompts to initialize fesk" )
            .example( "fesk -u", "Follow prompts to update styleguide version" )
            .example( "fesk -g", "Parses styleguide" )
            .example( "fesk -t", "Follow prompts to update styleguide theme" )
            .example( "fesk -p", "Adds partial file to main stylesheets")
            .example( "fesk", "generate styleguide" )
            .epilog( "Produced by fesk - Made in Oregon." )
            .argv;

if ( !argv.i && !argv.init && !argv.u && !argv.update && !argv.g && !argv.guide && !argv.t && !argv.theme && !argv.partial && !argv.p ) {
    argv.g = true;
}


var iquestions = [
  {
    type: "confirm",
    name: "copyBase",
    message: "Do you want to copy base files?",
    default: 'y'
  }
];
var tquestions = [
  {
    type: "list",
    name: "colors",
    message: "What color do you what to use in the styleguide?",
    choices: [ "red", "orange", "deeporange", "gold", "yellow", "lime", "lightgreen", "green", "teal", "cyan", "lightblue", "blue", "indego", "purple", "deeppurple", "pink", "bluegray", "custom" ],
    filter: function( val ) { return val.toLowerCase(); }
  }
];
var cquestions = [
  {
    type: "input",
    name: "custom",
    message: "What custom color do you want to use for the styleguide? (6 digit hex color):",
    validate: function( value ) {
      var pass = value.match(/(^#[0-9A-F]{6}$)/i);
      if (pass) {
        return true;
      } else {
        return "Please enter a valid hex color (did you remember # ?)";
      }
    }
  }
];

var squestions = [
    {
    type: "list",
    name: "type",
    message: "What kind of partial file is this",
    choices: [ "scss", "less", "stylus" ],
    filter: function( val ) { return val.toLowerCase(); }
  },
  {
    type: "list",
    name: "partial",
    message: "What kind of partial file is this",
    choices: [ "Utility", "Base", "Element", "Component", "Page", "Trump", "None" ],
    filter: function( val ) { return val.toLowerCase(); }
  },
  {
    type: "input",
    name: "file",
    message: "Name of sass file",
    default: "unamed"
  }
];

if (argv.init || argv.i) {

    console.log('Lets initialize this mother');
    inquirer.prompt( iquestions, function( ianswers ) {

        if (ianswers.copyBase === true) {
            feskFiles();
            feskInit();
            fesk();
        } else {
            feskInit();
            fesk();
        }
    });
}

if (argv.update || argv.u) {
    var logName = path.join(process.cwd() , '/styleguide/json/changeLog.json');
    var log = require(logName);
    var curr;

    if (typeof log[0] == 'object') {
        curr = log[0].version;
    }else{
        curr = "0.0.0";
    }

    console.log("Current version number: " + curr);

    var currBase = curr.replace(/(.)$/, "");
    var currInc = parseInt(curr[curr.length - 1]) + 1;
    var newCurr = currBase + currInc;

    inquirer.prompt([
          {
            type: "input",
            name: "version",
            message: "Version of styleguide?",
            default: newCurr
          },
          {
            type: "input",
            name: "comments",
            message: "Versions comments?",
            default: "No comments"
          }
        ], function( uanswers ) {
        log.unshift({version: uanswers.version.toString() , comment: uanswers.comments , date: new Date().toISOString()});
        fs.writeFile(logName, JSON.stringify(log, null,4));
        fesk();
    });
}

if (argv.guide || argv.g) {
    fesk();
}

if (argv.theme || argv.t) {
    feskColors();
}

if (argv.partial || argv.p) {
    feskPartial();
}

function feskInit() {
    cpr(
        sourceStyle,
        destStyle,
        {
            overwrite: false,
            confirm: true
        },
        function (err, files) { if (err) {return console.log('Woah, cool your jets pound cake, looks like something went awry.'+ files );}
    });
    console.log('Hoozah! the styleguide stuff has been generated');
}

function feskFiles() {
    cpr(
        path.join(process.cwd() ,  'node_modules/fesk/dev'),
        process.cwd(),
        {
            overwrite: false,
            confirm: true
        },
        function (err) {if (err) {return console.log('Woah, cool your jets pound cake, looks like something went awry.'+ err );}

        if (argv.init || argv.i) {

            feskColors();

        }
    });
}

function feskColors() {
    inquirer.prompt( tquestions, function( tanswers ) {
        switch (tanswers.colors) {
            case 'red':
                feskTheme("#f44336");
                break;
            case 'deeporange':
                feskTheme("#ff5722");
                break;
            case 'orange':
                feskTheme("#ff9800");
                break;
            case 'gold':
                feskTheme("#ffc107");
                break;
            case 'yellow':
                feskTheme("#ffeb3b");
                break;
            case 'lime':
                feskTheme("#cddc39");
                break;
            case 'lightgreen':
                feskTheme("#8bc34a");
                break;
            case 'green':
                feskTheme("#4caf50");
                break;
            case 'teal':
                feskTheme("#009688");
                break;
            case 'cyan':
                feskTheme("#00bcd4");
                break;
            case 'lightblue':
                feskTheme("#03a9f4");
                break;
            case 'blue':
                feskTheme("#2196f3");
                break;
            case 'indego':
                feskTheme("#3f51b5");
                break;
            case 'purple':
                feskTheme("#9c27b0");
                break;
            case 'deeppurple':
                feskTheme("#673ab7");
                break;
            case 'pink':
                feskTheme("#e91e63");
                break;
            case 'bluegray':
                feskTheme("#607d8b");
                break;
            case 'custom':
                inquirer.prompt( cquestions, function( canswers ) {
                    feskTheme(canswers.custom);
                });
                break;
        }
    });
}

function feskTheme(themeColor) {
    var themeCSS = " /* Basic themeing classes (color, background-color, border-color) */ .theme-main { color: " + themeColor + "; } .theme-main-color { background-color: " + themeColor + "; } .theme-main-border { border-color: " + themeColor + "; } .theme-highlight:hover { background-color: " + fnHexTransparent(0.12, themeColor) + "; } /* Fill and stroke for themeing SVGs */.theme-main-fill { fill: " + themeColor + "; } .theme-main-stroke { stroke: "+ themeColor + "; } /* classes for themeing buttons. */ .theme-main-btn { color:" + fnLightness(themeColor) + "; background-color: " + themeColor + "; } .theme-main-btn:hover { color:" + fnLightness(themeColor) + "; background-color: " + fnShadeBlendConvert(-0.13, themeColor) + "; } ::-moz-selection, ::selection { color: #333; background: " + fnHexTransparent(0.3, themeColor) + "; } .fsk h1,.fsk h2, .fsk h3, .fsk h4, .fsk h5, .fsk h6 { color: " + themeColor + "} .fsk-ink { background: " + fnHexTransparent(0.3, themeColor) + ";} .fsk-nav-footer a { color: " + fnShadeBlendConvert(-0.3, themeColor) + "; } .fsk-sub-nav-item .active, .fsk-menu-item .active { color: " + themeColor + "; border-right-color: " + themeColor + "; } .fsk-svg-node { fill: " + themeColor + ";} .fsk-sub-navicon.is-triggered svg { fill: " + themeColor + "} .ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y { background-color: " + fnShadeBlendConvert(-0.5, themeColor) + "} .ps-container:hover > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y { background-color: " + themeColor + ";}.ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y { background-color: " + fnShadeBlendConvert(0.13, themeColor) + ";}";


    fs.writeFile('./styleguide/css/theme.css', themeCSS.toString() , function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log("Theme file is generated.");
    });
}

function feskPartial() {

    var fileType = '';
    var filePart = '';
    var stylePart = '';

    inquirer.prompt( squestions, function( sanswers ) {

         switch (sanswers.type) {
            case 'scss':
                fileType = '.scss';
                break;
            case 'less':
                fileType = '.less';
                break;
            case 'stylus':
                fileType = '.styl';
                break;
            }

         switch (sanswers.partial) {
            case 'utility':
                filePart = 'u-';
                stylePart = '// base';
                break;
            case 'base':
                filePart = 'b-';
                stylePart = '// element';
                break;
            case 'element':
                filePart = 'e-';
                stylePart = '// component';
                break;
            case 'component':
                filePart = 'c-';
                stylePart = '// page';
                break;
            case 'page':
                filePart = 'p-';
                stylePart = '// trump';
                break;
            case 'trump':
                filePart = 't-';
                stylePart = '// misc';
                break;
            case 'none':
                filePart = '';
                stylePart = '// misc';
                break;
            }

        var file = sanswers.file.replace(/\^\\:\*\?"<>\|/, '').replace(/\s/, '-');

        var fileName = "_" + filePart + file.toLowerCase() + fileType.toString();
        var partialPath = path.join(process.cwd() , 'css/partials/' + fileName);
        fs.writeFile(partialPath,"/* ------------------------------------------------\r\n *  " + file.toUpperCase() + "\r\n *  ------------------------------------------------ */");

          var line = "@import '" + filePart + file.toLowerCase() + "';";

          var search = stylePart;

          var body = fs.readFileSync('css/partials/styles.scss').toString();

          if (body.indexOf(search) > 0 ) {
            body = body.split('\r');
            console.log(body);
            if (sanswers.partial == 'none') {
                body.push(line);
            } else {
                body.splice(body.indexOf(search) - 1,0,line);
            }
            var output = body.join('\r');
            fs.writeFileSync('css/partials/styles.scss', output);
          }

    });
}

function fesk() {
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


        //console.log('start parsing css file' + sourceCSS);
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

            // Add size and modified date to statGuide.json
            var stats    = fs.statSync(destCSS ),
                statName = path.join(process.cwd() , 'styleguide/json/statGuide.json'),
                stat     = require(statName);

            stat[0].fileSize = stats.size / 1000.0 + ' KBs';
            stat[0].publish = stats.mtime;
            fs.writeFile(statName, JSON.stringify(stat, null,4));

            // Create helper css to simulate hover, disabled, active, focus and visited pseudo styles
            var helperCSS = path.join(process.cwd() , 'styleguide/css/helperStyles.css'),
                styles    = postcss.parse(output),
                pseudos,
                replaceRule,
                selectors = [];

                pseudos   = /(\:hover|\:disabled|\:active|\:visited|\:focus)/g;

            styles.walkRules(function (rule) {
                if (pseudos.test(rule)) {
                    replaceRule = function(matched, stuff) {
                      return ".pseudo-class-" + matched.replace(':', '');
                    };
                    var rules = rule.toString().replace(pseudos, replaceRule);
                    selectors.push(rules);
                }
            });


            fs.writeFile(helperCSS, selectors.toString().replace(/\},/g, '}') );

            return console.log("OMG! its done its done its done!!");
        });
    } else {
        if (!argv.init || !argv.i) {
            return console.log('Please add a style.css file to the css/partials folder.');
        }
    }

}

// Color functions for the theme generation
function fnShadeBlendConvert(p, from, to) {
    if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
    if(!this.sbcRip)this.sbcRip=function(d){
        var l=d.length,RGB=new Object();
        if(l>9){
            d=d.split(",");
            if(d.length<3||d.length>4)return null;//ErrorCheck
            RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
        }else{
            switch(l){case 8:case 6:case 3:case 2:case 1:return null;} //ErrorCheck
            if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
            d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
        }
        return RGB;}
    var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=sbcRip(from),t=sbcRip(to);
    if(!f||!t)return null; //ErrorCheck
    if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
    else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
}


function fnHexTransparent(p, hexa) {
    var hex = hexa.replace('#', '');

    var c_r = fnHexStringToInt(hex.substr(0, 2));
    var c_g = fnHexStringToInt(hex.substr(2, 2));
    var c_b = fnHexStringToInt(hex.substr(4, 2));

    return "rgba(" + c_r + ", " + c_g + ", " + c_b + ", " + p + ")";

}


function fnLightness(hexa) {
    var hex = hexa.replace('#', '');

    var c_r = fnHexStringToInt(hex.substr(0, 2));
    var c_g = fnHexStringToInt(hex.substr(2, 2));
    var c_b = fnHexStringToInt(hex.substr(4, 2));

    if ((((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000) > 180 ) {
        return "#333";
    } else {
        return "#fff";
    }
}

function fnHexStringToInt(hex_string) {
    hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
    return parseInt(hex_string, 16);
}