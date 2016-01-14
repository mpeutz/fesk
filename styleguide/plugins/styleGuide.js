module.exports = function styleGuide( opts ) {
    opts = opts || {};

    // Work with options here

    return function( css ) {

        var fs = require( "fs" );
        var styleJSON = [];
        var specificityJSON = [];
        var statJSON = [];
        var pathSVG = [];
        var nodesSVG ='';
        var tocArray = ["TABLE OF CONTENT:\r\n"];

        //Variables used as Regex on comments
        var metaGuide = /^guide:/i;
        var chapterGuide = /^chapter:/i;
        var styleGuide = /^section:/i;
        var colorGuide = /^colors:/i;
        var processGuide =/^process:|^processed:|^preprocessor:|^sass:|^scss:|^stylus:|^less|^stl/i;

        //Generate each of the styleGuide blocks
        css.walkComments( function( comment ) {
            node = comment.text;


            // Global Stylesheet meta data (only one lives in the styles guide)
            if ( node.match( metaGuide ) ) {

                //normalize the node string
                node = node
                    .replace( /(?:\\[rn]|[\r\n]+)+/g, "\r\n" )
                    .replace( /\w+:/g, '^$&' );

                // Use arbitrary character as delimiter
                var metas = node.split( "^" );


                metaBlock = {
                    title:'',
                    client: '',
                    type: 'meta',
                    description: '',
                    version: '',
                    date: '',
                    author: '',
                    email: '',
                    url: '',
                    toc:''
                };

                for ( var p = 0; p < metas.length; p++ ) {
                    var metaProp = metas[ p ].toString();
                    getTitle(metaProp, metaBlock);
                    getClient(metaProp, metaBlock);
                    getVersion( metaProp, metaBlock );
                    getDescription( metaProp, metaBlock );
                    getCreatedBy( metaProp, metaBlock );
                    getAuthor( metaProp, metaBlock );
                    getEmail( metaProp, metaBlock );
                    getURL( metaProp, metaBlock );
                }

                // Reformat Meta comments
                comment.cloneBefore().replaceWith('/* ------------------------------------------------\r\n * ' + metaBlock.title + ' \r\n * ' + metaBlock.description+ ' \r\n * version: ' + metaBlock.version + ' \r\n * date published: ' + metaBlock.date + '\r\n * ------------------------------------------------ */').toString();

            }


            // Chapter Sections
            if ( node.match( chapterGuide ) ) {

                //normalize the node string
                node = node
                    .replace( /--*-/g, '' )
                    .replace( /(?:\\[rn]|[\r\n]+)+/g, "\r\n" )
                    .replace( /\w+:/g, '^$&' );

                // Use arbitrary character as delimiter
                var chapters = node.split( "^" );

                chapterBlock = {
                    order: '',
                    group: '',
                    reference: '0',
                    title:'',
                    type: 'chapter',
                    description: '',
                };

                for ( var h = 0; h < chapters.length; h++ ) {
                    var chapterProp = chapters[ h ].toString();
                    getTitle(chapterProp, chapterBlock);
                    getChapter( chapterProp, chapterBlock );
                    getDescription( chapterProp, chapterBlock );

                }

                tocArray.push(chapterBlock.title.toUpperCase() + ' ' + chapterBlock.order + '\r\n');
                styleJSON.push( chapterBlock );

                // remove Chapter comments and replace with just chapter title and name
                comment.replaceWith('/* ------------------------------------------------\r\n * ' + chapterBlock.group + '.............................' + chapterBlock.title + '\r\n * ------------------------------------------------ */').toString();


            }


            if ( node.match( styleGuide ) ) {

                var filesource = comment.source.input.file;

                var styleBlock = {
                    order: '',
                    group: '',
                    title: '',
                    reference: '',
                    type: '',
                    tags: [],
                    file: '',
                    compatibility: [],
                    states: [],
                    description: '',
                    note: '',
                    code: ''
                };


                //normalize the node string
                node = node
                    .replace( /--*-/g, '' )
                    .replace( /(?:\\[rn]|[\r\n]+)+/g, "\r\n" )
                    .replace( /\w+:/g, '^$&' );

                // Use arbitrary character as delimiter
                var sections = node.split( "^" );


                for ( var k = 0; k < sections.length; k++ ) {
                    var property = sections[ k ].toString();

                    getRef( property, styleBlock );
                    getTitle( property, styleBlock );
                    getType( property, styleBlock );
                    getTags( property, styleBlock );
                    getCompatibility( property, styleBlock );
                    getDescription( property, styleBlock );
                    getNote( property, styleBlock );
                    getFile( property, styleBlock );
                    getCodeStates( property, styleBlock );

                }
                styleJSON.push( styleBlock );
                // remove Guide comments
                comment.remove();
            }

            if ( node.match( processGuide ) ) {

                //normalize the node string
                node = node
                    .replace( /--*-/g, '' )
                    .replace( /(?:\\[rn]|[\r\n]+)+/g, "\r\n" )
                    .replace( /\w+:/g, '^$&' );

                // Use arbitrary character as delimiter
                var process = node.split( "^" );

                processorBlock = {
                    order: '',
                    group: '',
                    reference: '',
                    type: 'preprocessor',
                    title: '',
                    description: '',
                    note: '',
                    lang: '',
                    vars: [],
                    logic: ''
                };

                for ( var o = 0; o < process.length; o++ ) {
                    var processorProp = process[ o ].toString();
                    getTitle( processorProp, processorBlock );
                    getDescription( processorProp, processorBlock );
                    getprocessorRef( processorProp, processorBlock );
                    getNote( processorProp, processorBlock );
                    getprocessorLang( processorProp, processorBlock );
                    getprocessorVars( processorProp, processorBlock );
                    getprocesserCode( processorProp, processorBlock );
                }
                styleJSON.push( processorBlock );

                // remove Colors comments
                comment.remove();
            }

            if ( node.match( colorGuide ) ) {

                //normalize the node string
                node = node
                    .replace( /--*-/g, '' )
                    .replace( /(?:\\[rn]|[\r\n]+)+/g, "\r\n" )
                    .replace( /\w+:/g, '^$&' );

                // Use arbitrary character as delimiter
                var colors = node.split( "^" );

                colorBlock = {
                    order: '',
                    group: '',
                    reference: '',
                    type: 'color',
                    title: '',
                    note: '',
                    description: '',
                    color: []
                };

                for ( var o = 0; o < colors.length; o++ ) {
                    var colorProp = colors[ o ].toString();
                    getTitle( colorProp, colorBlock );
                    getNote( colorProp, colorBlock );
                    getDescription( colorProp, colorBlock );
                    getColorRef( colorProp, colorBlock );
                    getColorList( colorProp, colorBlock );
                }
                styleJSON.push( colorBlock );

                // remove Colors comments
                comment.remove();
            }


        } );

        // Generate stats
        statJSON.push( calcStats( css ) );

        // Find selectors and calculate specificity
        var counter = 0;
        css.walkRules( function( rule ) {
            for(var n = 0; n < rule.selectors.length; n++) {
            specificityBlock = {
                specificity: '',
                selector: '',
                rank: '',
                from: '',
                line: '',
                declarations: '',
                count: ''
            };

            var from = rule.source.input.from;
                counter++;
                specificityBlock.selector = rule.selectors[n];
                specificityBlock.specificity = calcSpecificity( rule.selectors[n] ).specificity;
                specificityBlock.rank = calcSpecificity( rule.selectors[n] ).rank.toString();
                specificityBlock.from = from.match( /[\w-]+\.+.*/ ).toString();
                specificityBlock.line = rule.source.start.line;
                specificityBlock.declarations = rule.nodes.length;
                specificityBlock.count = counter;

                specificityJSON.push( specificityBlock );

            }


        } );

        // Sort JSON array so section are in group/reference order
        styleJSON.sort( function( a, b ) {
            return parseFloat( a.order ) - parseFloat( b.order );
        } );

        // Build the TOC and insert it at the top of the stylesheet
        css.walkComments( function( comment ) {
            node = comment.text;
            if ( node.match( /^title:/i ) ) {
                comment.text = node + '\r\n' + tocArray.toString().replace(/\,/gi,'').replace( /^\s+|\s+$/, '', 0 );
            }
            if ( node.match( metaGuide ) ) {
                comment.cloneAfter().replaceWith('/* ------------------------------------------------\r\n' + tocArray.toString().replace(/\,/gi,'').replace( /\r\n/g, '\r\n * ' ).replace( /(TABLE OF CONTENT:)/g, ' * TABLE OF CONTENT:' ) + ' ------------------------------------------------ */');
                comment.remove();
            }
        });

        metaBlock.toc = tocArray;
        styleJSON.unshift( metaBlock );

        //Draw specificity graph with svg and save file to be used in style guide. FTW
        var specSVG = drawSVG(specificityJSON);
        fs.writeFileSync( './styleguide/assets/graph.svg', specSVG );

        // Create JSON files for styleguide, statistics, and specificity.
        fs.writeFileSync( './styleguide/json/statGuide.json', JSON.stringify( statJSON, null, 4 ) );
        fs.writeFileSync( './styleguide/json/specificityGuide.json', JSON.stringify( specificityJSON, null, 4 ) );
        fs.writeFileSync( './styleguide/json/styleGuide.json', JSON.stringify( styleJSON, null, 4 ) );
    };
};

// functions for parsing string data
singleLine = function( data ) {
    data = data
        .replace( /^\s+|\s+$/, '', 0 )
        .replace( /\n\r|\r\n/g, ' ' )
        .replace( /\r/g, ' ' )
        .replace( /\n/g, ' ' )
        .replace( /\t/g, '' )
        .replace( /\n+\n/g, ' ' );
    return data;
};

multiLine = function( data ) {
    data = data
        .replace( /^\s+|\s+$/, '', 0 )
        .replace( /^\n|^\n\r|^\r\n|^\s/g, ' ' )
        .replace( /\r\n\r\n/g, '\r\n' );
    return data;
};

getChapter = function( prop, data ) {
    if ( hasPrefix( prop, 'chapter' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        data.order = singleLine( subprop ) + '.0';
        data.group = singleLine( subprop );
    }
};

getColorRef = function( prop, data ) {
    if ( hasPrefix( prop, 'colors' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        data.order = singleLine( subprop );
        data.group = singleLine( subprop.replace( /\.+[0-9]*/, '' ) );
        data.reference = singleLine( subprop.replace( /\d*\./, '' ) );
    }
};

getColorList = function( prop, data ) {
    if ( hasPrefix( prop, 'palette' ) || hasPrefix( prop, 'pallet' ) || hasPrefix( prop, 'colorlist' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        var col = subprop.split( /~~~/ );
        for ( var c = 0; c < col.length; c++ ) {
            colorGroup = {
                title: '',
                hue: '',
                use: ''
            };
            var hue = col[ c ].match( /[^\r\n]+/g );
            colorGroup.title = hue[ 0 ];
            colorGroup.hue = hue[ 1 ];
            colorGroup.use = hue[ 2 ];
            data.color.push( colorGroup );
        }
    }
};

getprocessorRef = function( prop, data ) {
    if ( hasPrefix( prop, 'process' ) || hasPrefix( prop, 'processor' ) || hasPrefix( prop, 'sass' ) || hasPrefix( prop, 'scss' )) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        data.order = singleLine( subprop );
        data.group = singleLine( subprop.replace( /\.+[0-9]*/, '' ) );
        data.reference = singleLine( subprop.replace( /\d*\./, '' ) );
    }
};


getprocessorLang = function( prop, data ) {
    if ( hasPrefix( prop, 'lang' ) || hasPrefix( prop, 'language' ) ) {
        data.lang = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getprocessorVars = function( prop, data ) {
    if ( hasPrefix( prop, 'vars' ) || hasPrefix( prop, 'var' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        var vari = subprop.split( /~~~/ );
        for ( var a = 0; a < vari.length; a++ ) {
            varGroup = {
                title: '',
                use: ''
            };
            var varis = vari[ a ].match( /[^\r\n]+/g );
            varGroup.title = varis[ 0 ];
            varGroup.use = varis[ 1 ];
            data.vars.push( varGroup );
        }
    }
};

getprocesserCode = function( prop, data ) {
    if ( hasPrefix( prop, 'logic' ) || hasPrefix( prop, 'logic' ) || hasPrefix( prop, 'mixin' ) || hasPrefix( prop, 'function' ) ) {
        data.logic = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) + "{ ... }" );
    }
};

getRef = function( prop, data ) {
    if ( hasPrefix( prop, 'section' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        data.order = singleLine( subprop );
        data.group = singleLine( subprop.replace( /\.+[0-9]*/, '' ) );
        data.reference = singleLine( subprop.replace( /\d*\./, '' ) );
    }
};



getTitle = function( prop, data ) {
    if ( hasPrefix( prop, 'title' ) || hasPrefix( prop, 'guide' ) ) {
        data.title = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getClient = function( prop, data ) {
    if ( hasPrefix( prop, 'client' ) || hasPrefix( prop, 'company' ) ) {
        data.client = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getType = function( prop, data ) {
    if ( hasPrefix( prop, 'type' ) ) {
        var subprop = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        if (subprop.match(/html/gmi)) {
            data.type = 'markup';
        } else {
            data.type = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
        }
    }
};

getAuthor = function( prop, data ) {
    if ( hasPrefix( prop, 'author' ) ) {
        data.author = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getCreatedBy = function( prop, data ) {
    if ( hasPrefix( prop, 'date' ) ) {
        data.date = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getVersion = function( prop, data ) {
    if ( hasPrefix( prop, 'version' ) ) {
        data.version = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getEmail = function( prop, data ) {
    if ( hasPrefix( prop, 'email' ) ) {
        data.email = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getURL = function( prop, data ) {
    if ( hasPrefix( prop, 'url' ) ) {
        data.url = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

getFile = function( prop, data ) {
    if ( hasPrefix( prop, 'file' ) ) {
        var fileref = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' );
        if (fileref === undefined) {
            fileref = filesource.match(/([\w -]+\.\w+)[^/]*$/g).toString();
        }
        data.file = fileref;
    }
};


getTags = function( prop, data ) {
    if ( hasPrefix( prop, 'tags' ) ) {
        var array = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ).replace( /\s/g, ''));
        data.tags = array.split( ',' );
    }
};

getCompatibility = function( prop, data ) {
    if ( hasPrefix( prop, 'compatibility' ) ) {
        var compArray = {};
        var array = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
        array = array.replace( /\s/, '' );
        var compat = array.split( ',' );
        for ( var c = 0; c < compat.length; c++ ) {
            if ( compat[ 0 ] ) {
                compArray.ie = compat[ 0 ];
            }
            if ( compat[ 1 ] ) {
                compArray.ff = compat[ 1 ];
            }
            if ( compat[ 2 ] ) {
                compArray.chr = compat[ 2 ];
            }
            if ( compat[ 3 ] ) {
                compArray.op = compat[ 3 ];
            }
            if ( compat[ 4 ] ) {
                compArray.ios = compat[ 4 ];
            }
            if ( compat[ 5 ] ) {
                compArray.and = compat[ 5 ];
            }
        }
        data.compatibility = compArray;
    }
};

getDescription = function( prop, data ) {
    if ( hasPrefix( prop, 'description' ) ) {
        data.description = multiLine( prop.replace( /^\s*(description)+\:\s+?/i, '' ));
    }
};

getNote = function( prop, data ) {
    if ( hasPrefix( prop, 'note' ) ) {
        data.note = multiLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ) );
    }
};

// Create modifiers object
getCodeStates = function( prop, data ) {
    if ( hasPrefix( prop, 'modifiers' ) ) {
        var states = [];
        var array = singleLine( prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ).replace( /\n/g, '' ) );
        var mod = array.split( '   ' );
        for ( var m = 0; m < mod.length; m++ ) {
            var modArray = {
                title: '',
                description: '',
                class: ''
            };
            mod[ m ] = mod[ m ].replace( /^\s+|\s+$/, '', 0 );
            modArray.title = mod[ m ].split( /\s+\-\s+/, 1 )[ 0 ];
            modArray.description = mod[ m ].replace( modArray.title, '', 1 ).replace( /\s+\-\s+/, '');
            modArray.class = modArray.title.replace( /\:/, '.pseudo-class-' );
            var classPlus = modArray.class.replace( /\./g, ' ' ).replace( /^\s*/g, '' );
            states.push( modArray );
        }
        data.states = states;
    }

    if ( hasPrefix( prop, 'code' ) ) {
        var code = [];
        var cArray = prop.replace( /^\s*?[a-z ]+\:\s+?/i, '' ).replace( /\n/g, '' );
        code.push( {
            title: 'default',
            description: 'default state of component',
            class: 'null',
            code: cArray.replace( /\s+\{\$mod\}/g, '' ).replace(/\n?\r/g, "\r\n")
        } );
        for ( var c = 0; c < data.states.length; c++ ) {
            codeArray = {
                title: '',
                description: '',
                class: '',
                code: ''
            };
            codeArray.title = data.states[ c ].title;
            codeArray.description = data.states[ c ].description;
            codeArray.class = data.states[ c ].class;
            codeArray.code = cArray.replace( /\{\$mod\}/g, data.states[ c ].class.replace( /\./g, ' ' ).replace( /^\s*/g, '' ).replace(/\n?\r/g, "\r\n"));
            code.push( codeArray );
        }
        data.code = code;
        delete data.states;
    }

};

hasPrefix = function( description, prefix ) {
    return !!description.match( new RegExp( '^\\s*?' + prefix + '\\:', 'gmi' ) );
};


// Calculate the specificity for a selector by dividing it into simple selectors and counting them
calcSpecificity = function( data ) {
    var selector = data,
        getSelector,
        typeCount = {
            'a': 0,
            'b': 0,
            'c': 0
        },
        attributeRegex = /(\[[^\]]+\])/g,
        idRegex = /(#[^\s\+>~\.\[:]+)/g,
        classRegex = /(\.[^\s\+>~\.\[:]+)/g,
        pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,
        pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi,
        pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g,
        elementRegex = /([^\s\+>~\.\[:]+)/g;

    getSelector = function( regex, type ) {
        var matches, i, len, match, index, length;
        if ( regex.test( selector ) ) {
            matches = selector.match( regex );
            for ( i = 0, len = matches.length; i < len; i += 1 ) {
                typeCount[ type ] += 1;
                match = matches[ i ];
                index = selector.indexOf( match );
                length = match.length;
                selector = selector.replace( match, Array( length + 1 ).join( ' ' ) );
            }
        }
    };

    // Remove the negation psuedo-class (:not) but leave its argument because specificity is calculated on its argument
    ( function() {
        var regex = /:not\(([^\)]*)\)/g;
        if ( regex.test( selector ) ) {
            selector = selector.replace( regex, '     $1 ' );
        }
    }() );

    // Remove anything after a left brace in case a user has pasted in a rule, not just a selector
    ( function() {
        var regex = /{[^]*/gm,
            matches, i, len, match;
        if ( regex.test( selector ) ) {
            matches = selector.match( regex );
            for ( i = 0, len = matches.length; i < len; i += 1 ) {
                match = matches[ i ];
                selector = selector.replace( match, Array( match.length + 1 ).join( ' ' ) );
            }
        }
    }() );

    getSelector( attributeRegex, 'b' );
    getSelector( idRegex, 'a' );
    getSelector( classRegex, 'b' );
    getSelector( pseudoElementRegex, 'c' );
    getSelector( pseudoClassWithBracketsRegex, 'b' );
    getSelector( pseudoClassRegex, 'b' );
    selector = selector.replace( /[\*\s\+>~]/g, ' ' );
    selector = selector.replace( /[#\.]/g, ' ' );
    getSelector( elementRegex, 'c' );

    var totals = ( Math.floor(typeCount.ac == 1.0 ? 255 : typeCount.a * 256.0) * 100 ) * 10 + ( Math.floor(typeCount.b == 1.0 ? 255 : typeCount.b * 256.0) * 10 ) * 10 + Math.floor(typeCount.c == 1.0 ? 255 : typeCount.c * 256.0) * 10;

    return {
        rank: ( typeCount.a * 100 ) + ( typeCount.b * 10 ) + typeCount.c,
        specificity: '0,' + typeCount.a.toString() + ',' + typeCount.b.toString() + ',' + typeCount.c.toString(),
    };
};

// Statistics function
calcStats = function( data ) {
    var fs = require( "fs" );
    var
        fileSize            = 0,
        published           = 0,
        rules               = 0,
        selectors           = [],
        ids                 = 0,
        universal           = 0,
        declarations        = 0,
        atRules             = 0,
        uAtRules            = [],
        color               = 0,
        uColor              = [],
        backgroundColor     = 0,
        uBackgroundColor    = [],
        fontSize            = 0,
        uFontSize           = [],
        uFontFamily         = [],
        height              = 0,
        width               = 0,
        float               = 0,
        important           = 0;


    function onlyUnique( value, index, self ) {
        return self.indexOf( value ) === index;
    }

    data.walkAtRules( function( rule ) {
        atRules++;
        uAtRules.push( rule.params );
    } );

    data.walkRules( function( rule ) {
        rules++;
        selectors.push( rule.selector );
        for ( var sl = 0; sl < rule.selectors.length; sl++ ) {
            if (rule.selectors[sl].match(/#[a-zA-Z0-9-]*/gi)) {
                ids++;
            }

            if (rule.selectors[sl].match(/\*/gi)) {
                universal++;
            }
        }
    } );

    data.walkDecls( function( decl ) {
        declarations++;
        if ( decl.prop == 'color' ) {
            color++;
            uColor.push( decl.value );
        }
        if ( decl.prop == 'background-color' ) {
            backgroundColor++;
            uBackgroundColor.push( decl.value );
        }
        if ( decl.prop == 'font-size' ) {
            fontSize++;
            uFontSize.push( decl.value );
        }
        if ( decl.prop == 'font-family' ) {
            uFontFamily.push( decl.value );
        }
        if ( decl.prop == 'height' ) {
            height++;
        }
        if ( decl.prop == 'width' ) {
            width++;
        }
        if ( decl.prop == 'float' ) {
            float++;
        }
        if ( decl.important ) {
            important++;
        }
    } );
    var selects = selectors.toString();

    return {
        fileSize: "00 KBs",
        publish: "12/31/2014",
        ruleCount: rules,
        selectorCount: selects.split( ',' ).length,
        idCount: ids,
        universalCount: universal,
        declorationCount: declarations,
        mediaQuerieCount: atRules,
        uniqueMediaQueries: uAtRules.filter( onlyUnique ),
        colorCount: color,
        uniqueColor: uColor.filter( onlyUnique ),
        backgroundColorCount: backgroundColor,
        uniqueBackgroundColor: uBackgroundColor.filter( onlyUnique ),
        fontSizeCount: fontSize,
        uniqueFontSize: uFontSize.filter( onlyUnique ),
        uniqueFontFamily: uFontFamily.filter( onlyUnique ),
        widthCount: width,
        heightCount: height,
        floatCount: float,
        importantCount: important
    };
};

module.exports.postcss = function styleGuide( css ) {
    return module.exports()( css );
};

// Create specificity SVG
function drawSVG (spec) {
    var svgHeight = 300;
    var svgWidth = 1200;
    var steps = svgWidth / spec.length + 2;
    var halfStep = steps / 2;
    halfStep = +halfStep.toFixed(4);
    var points =[];
    var nodes = [];

    for (i = 1; i < spec.length; i++) {
        var curr = steps * (i - 1.25);
        var currHalf = curr + halfStep;
        currHalf = +currHalf.toFixed(2);
        var rank = (spec[i].rank * -1) + (svgHeight - 3);
        if (i === 1 ) {
            points.push( "M" + currHalf + "," + rank);
        } else {
            points.push(" L" + currHalf + "," + rank);
        }

        var currSel = spec[i].selector.toString().replace(/"/g, "'");

        nodes.push('<g class="fsk-svg-group"><rect x="' + curr + '" y="0" width="' + steps +'" height="100%"  style="cursor: pointer; fill: rgba(255, 0 ,0,0);" onmouseover="changeText(' + spec[i].rank + ', \'' + currSel + '\', ' + spec[i].line + ', \'' + spec[i].from.toString() + '\')" /><circle class="fsk-svg-node" cx="' + currHalf + '" cy="' + rank + '" r="6"/></g>');
    }


    var specSVG = '<?xml-stylesheet type="text/css" href="../css/theme.css" ?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + svgWidth + ' ' +  svgHeight + '" onload="init()"><script><![CDATA[var text, textSpec, textSel, textFile, textLine;function init(){textSpec = document.getElementById("textSpec");textSel = document.getElementById("textSel");textFile = document.getElementById("textFile");textLine = document.getElementById("textLine");}function changeText(spec,sel,line,from){textSpec.textContent = spec;textSel.textContent = sel;textFile.textContent = from;textLine.textContent = line};function restoreText(){textSpec.textContent = "00"};]]></script><style>.fsk-svg-node{display:none;  stroke: #eee; stroke-width: 3px; cursor:pointer;}.fsk-svg-path{fill:none;stroke:#555;stroke-width:2px;} .fsk-svg-group { position: relative; } .fsk-svg-group:hover .fsk-svg-node {display:block;} .fsk-svg-group:hover .fsk-svg-dotted {display: block;}</style><path style="stroke:#000;" d="M0,' + (svgHeight - 3) + ' L' + svgWidth + ',' + (svgHeight - 3) + '"></path><path style="stroke:#999;" d="M0,' + (svgHeight - 53) + ' L' + svgWidth + ',' + (svgHeight - 53) + '"></path><path style="stroke:#999;" d="M0,' + (svgHeight - 103) + ' L' + svgWidth + ',' + (svgHeight - 103) + '"></path><path style="stroke:#999;" d="M0,' + (svgHeight - 153) + ' L' + svgWidth + ',' + (svgHeight - 153) + '"></path><path style="stroke:#999;" d="M0,' + (svgHeight - 203) + ' L' + svgWidth + ',' + (svgHeight - 203) + '"></path><path style="stroke:#999;" d="M0,' + (svgHeight - 253) + ' L' + svgWidth + ',' + (svgHeight - 253) + '"></path><path id="svgPath" class="fsk-svg-path" d="' + points.join('') + '"></path>' + nodes.join('') + '<text transform="translate(10 24)" fill="#555" font-family="sans-serif" font-size="24" id="textSpec">--</text><text transform="translate(10 40)" fill="#444" font-family="sans-serif" font-size="10" id="textSel">null</text><text transform="translate(55 20)" fill="#666" font-family="sans-serif" font-size="10">line: </text><text transform="translate(75 20)" fill="#444" font-family="sans-serif" font-size="10" id="textLine">--</text><text transform="translate(100 20)" fill="#666" font-family="sans-serif" font-size="10">file: </text><text transform="translate(120 20)" fill="#444" font-family="sans-serif" font-size="10" id="textFile">null</text></svg>';

    return specSVG;
 }
