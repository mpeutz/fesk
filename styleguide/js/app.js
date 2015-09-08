var msgApp = angular.module( 'msgApp', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'duScroll'] );


msgApp.config( function( $interpolateProvider, $routeProvider ) {


    $routeProvider.when( '/', {
        templateUrl: 'view/guideline.html',
        controller: 'titleCtrl',
        title: 'guideline'
    } ).when( '/search', {
        templateUrl: 'view/search.html',
        controller: 'titleCtrl',
        title: 'search'
    } ).when( '/dashboard', {
        templateUrl: 'view/dashboard.html',
        controller: 'titleCtrl',
        title: 'stats'
    } ).when( '/changelog', {
        templateUrl: 'view/changelog.html',
        controller: 'titleCtrl',
        title: 'changelog'
    } ).when( '/:section', {
        templateUrl: function( urlattr ) {
            return 'view/section.html';
        },
        controller: 'titleCtrl',
        title: 'section'
    } ).when( '/:section/:component', {
        templateUrl: function( urlattr ) {
            return 'view/component.html';
        },
        controller: 'titleCtrl',
        title: 'component'
    } ).otherwise( {
        templateUrl: 'view/404.html',
        controller: 'titleCtrl',
        title: "404 - it's a trap!"
    } );

} );


//Set title for each page.
msgApp.run( function( $rootScope, $route ) {
    $rootScope.$on( '$routeChangeSuccess', function( newRoute, oldRoute ) {
        $rootScope.title = $route.current.title;
    } );
} );

msgApp.controller( 'titleCtrl', function( $scope, $location, $http, $routeParams, $sce, $document, msg, stats, changelog ) {


    $scope.msg = {};
    var promise = msg.getStyles();
    promise.then( function( data ) {
        $scope.msg = data;
    } );

    $scope.stats = {};
    var statsPromise = stats.getStats();
    statsPromise.then( function( data ) {
        $scope.stats = data;
    } );

    $scope.changelog = {};
    var clPromise = changelog.getLog();
    clPromise.then( function( data ) {
        $scope.changelog = data;
    } );

    var container = angular.element( document.getElementById( 'msg-content' ) );
    $scope.toTheTop = function() {
        container.scrollTop( 0, 500 );
    };

    $scope.$on('$routeChangeSuccess', function(event,current,previous) {
        container.scrollTop( 0 );
    });

    $scope.renderHtml = function( htmlCode ) {
        return $sce.trustAsHtml( htmlCode );
    };

    $scope.isOneDeep = function( msg ) {
        return msg.reference === '0';
    };



    if ( $routeParams.section ) {
        $scope.categoryGroup = function() {
            return function( msg ) {
                return msg.group === $routeParams.section;
            };
        };
    }

    if ( $routeParams.component ) {
        $scope.categoryGroup = function() {
            return function( msg ) {
                return msg.order === $routeParams.component;
            };
        };
    }

    $scope.sectionGroup = function() {
        return function( msg ) {
            return msg.group === $routeParams.section;
        };
    };

    $scope.headerGroup = function() {
        return function( msg ) {
            return msg.reference === $routeParams.section;
        };
    };

    $scope.searched = function( newVal ) {
        if ( angular.isDefined( newVal ) ) {
            _val = newVal;
        }
        return _val;
    };

    $scope.isActive = function( viewLocation ) {
        var active = ( viewLocation === $location.path() );
        return active;
    };

    $scope.getClass = function( path ) {
        if ( $location.path().substr( 0, path.length ) == path ) {
            return "active";
        } else {
            return "";
        }
    };


    $scope.data = {
        message: "Transim"
    };



} );

msgApp.filter( 'flatten', function() {
    return function( obj ) {
        return obj.replace( /\s+/g, '-' ).toLowerCase();
    };
} );

msgApp.filter( 'cleaned', function() {
        return function( obj ) {
            if (obj) {
                return obj.toString().replace( /\,/g, '' );
            }
        };
} );

msgApp.filter('inArray', function() {
    return function(array, value) {
        if(array) {
            return array.indexOf(value) !== -1;
        }
    };
});


angular.module( "msgApp" ).directive( "msgComponent", function() {
    return {
        restrict: "E",
        templateUrl: "view/component-card.html"
    };
} );

angular.module( "msgApp" ).directive( "goBack", function() {
    return {
        restrict: "E",
        link: function( scope, elem ) {
            $( elem ).on( 'click', function() {
                $( '#searchText' ).val( '' );
            } );
        },
        template: "<div class='msg-back'><button class='msg-back-button' onclick='window.history.back()'><svg class='msg-icon'><use xlink:href='#back' /></svg></button></div>"
    };
} );

angular.module("msgApp").directive("copyMarkup", function() {
    return {
        restrict: "A",
        link: function(scope, elem) {
            var btn = elem[0];
            btn.addEventListener("click", clickHandler, false);
            btn.addEventListener("copy", copyHandler, false);

            function clickHandler(e) {
              e.target.dispatchEvent(new ClipboardEvent("copy"));
            }

            function copyHandler(e) {
              e.clipboardData.setData("text/plain", "Simulated copy. Yay!");

              // CRITICAL: Must call `preventDefault();` to get this data into the system/desktop clipboard!!!
              e.preventDefault();
            }
        }
    };
});

angular.module( "msgApp" ).directive( "searchInput", function( $interval ) {
    return {
        restrict: "A",
        link: function( scope, elem, attrs ) {
            var loc;
            $( elem ).on( 'focus', function() {
                $( this ).addClass( 'is-focused' );
                if ( window.location.hash !== '/search' ) {
                    loc = window.location.hash;
                } else {
                    window.location.hash = '/1';
                }
            } ).on( 'blur', function() {
                if ( $( this ).val().length === 0 ) {
                    $( this ).removeClass( 'is-focused' );
                }
            } );
            $( elem ).keyup( function() {
                var s = $( this ).val();
                if ( s.length > 2 ) {
                    window.location.hash = '/search';
                } else {
                    window.location.hash = loc;
                }
            } );
            $( '.msg-clear' ).on( 'click', function() {
                $( elem ).val( '' );
                window.location.hash = loc;
                $( elem ).removeClass( 'is-focused' );
            } );
        }
    };
} );

angular.module( 'msgApp' )
    .directive( 'shadowDom', function( msg, $templateCache ) {

        var USER_STYLES_TEMPLATE = 'userStyles.html';

        return {
            restrict: 'E',
            transclude: true,
            link: function( scope, element, attrs, controller, transclude ) {

                scope.$watch( function() {
                    return msg;
                }, function() {
                    if ( typeof element[ 0 ].createShadowRoot === 'function' && ( msg && !msg.disableEncapsulation ) ) {
                        angular.element( element[ 0 ] ).empty();
                        var root = angular.element( element[ 0 ].createShadowRoot() );
                        root.append( $templateCache.get( USER_STYLES_TEMPLATE ) );
                        transclude( function( clone ) {
                            root.append( clone );
                        } );
                    } else {
                        transclude( function( clone ) {
                            var root = angular.element( element[ 0 ] );
                            root.empty();
                            root.append( clone );
                        } );
                    }
                }, true );

            }
        };
    } );

angular.module( "msgApp" ).directive( 'stickyHeader', function() {
    return {
        restrict: 'A',
        link: function( scope, elem, attrs ) {
            var $element = $( '.msg-main' ).css( 'right', '0' );
            $element.scroll( function() {
                if ( $element.scrollTop() >= 50 ) {
                    $( elem ).addClass( 'scrolled' );
                } else {
                    $( elem ).removeClass( 'scrolled' );
                }
            } );
        }
    };
} );

// angular.module( "msgApp" ).directive( 'collapser', function() {
//     return {
//         restrict: 'A',
//         link: function( scope, elem, attrs ) {
//             scope.$watch('isShown', function(newValue, oldValue) {
//                     if (oldValue) {
//                         var offsetHeight = $(elem).height();
//                         $(elem).css('max-height', offsetHeight);
//                         console.log('Changed!');
//                     }
//                 });
//         }
//     };
// } );

angular.module( 'msgApp' ).directive( 'markdown', function() {
    var converter = new Showdown.converter();
    return {
        restrict: 'E',
        link: function( scope, element, attrs ) {
            var htmlText = converter.makeHtml( element.text() );
            element.html( htmlText );
        }
    };
} );

angular.module( "msgApp" ).directive( "svgIcon", function() {
    return {
        restrict: "EA",
        scope: {
            icon: '@'
        },
        template: "<svg class='msg-icon msg-svg-{{icon}}'><use xlink:href=''></use></svg>",
        link: function( scope, elem, attrs ) {
            $( elem ).find( 'use' ).attr( {
                'xlink:href': '#' + scope.icon
            } );
        }
    };
} );

msgApp.directive( 'ngPrism', [ '$compile', function( $compile ) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            source: '@'
        },
        link: function( scope, element, attrs, controller, transclude ) {
            scope.$watch( 'source', function( v ) {
                element.find( "code" ).html( v );
                Prism.highlightElement( element.find( "code" )[ 0 ] );
            } );

            transclude( function( clone ) {
                if ( clone.html() !== undefined ) {
                    element.find( "code" ).html( clone.html() );
                    $compile( element.contents() )( scope.$parent );
                }
            } );
        },
        template: "<code></code>"
    };
} ] );


angular.module( 'msgApp' ).service( "msg", function( $http, $q ) {
    var msg = $q.defer();
    $http.get( 'json/styleGuide.json' ).success( function( data ) {
        msg.resolve( data );
    } );
    this.getStyles = function() {
        return msg.promise;
    };
} );

angular.module( 'msgApp' ).service( "stats", function( $http, $q ) {
    var stats = $q.defer();
    $http.get( 'json/statGuide.json' ).success( function( data ) {
        stats.resolve( data );
    } );
    this.getStats = function() {
        return stats.promise;
    };
} );

angular.module( 'msgApp' ).service( "changelog", function( $http, $q ) {
    var changelog = $q.defer();
    $http.get( 'json/changeLog.json' ).success( function( data ) {
        changelog.resolve( data );
    } );
    this.getLog = function() {
        return changelog.promise;
    };
} );