var fskApp = angular.module( 'fskApp', [ 'ngRoute', 'ngSanitize', 'ngAnimate', 'duScroll'] );


fskApp.config( function( $interpolateProvider, $routeProvider ) {


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
fskApp.run( function( $rootScope, $route ) {
    $rootScope.$on( '$routeChangeSuccess', function( newRoute, oldRoute ) {
        $rootScope.title = $route.current.title;
    } );
} );

fskApp.controller( 'titleCtrl', function( $scope, $location, $http, $routeParams, $sce, $document, fsk, stats, changelog ) {


    $scope.fsk = {};
    var promise = fsk.getStyles();
    promise.then( function( data ) {
        $scope.fsk = data;
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

    var container = angular.element( document.getElementById( 'fsk-content' ) );
    $scope.toTheTop = function() {
        container.scrollTop( 0, 500 );
    };

    $scope.$on('$routeChangeSuccess', function(event,current,previous) {
        container.scrollTop( 0 );
    });

    $scope.renderHtml = function( htmlCode ) {
        return $sce.trustAsHtml( htmlCode );
    };

    $scope.isOneDeep = function( fsk ) {
        return fsk.reference === '0';
    };



    if ( $routeParams.section ) {
        $scope.categoryGroup = function() {
            return function( fsk ) {
                return fsk.group === $routeParams.section;
            };
        };
    }

    if ( $routeParams.component ) {
        $scope.categoryGroup = function() {
            return function( fsk ) {
                return fsk.order === $routeParams.component;
            };
        };
    }

    $scope.sectionGroup = function() {
        return function( fsk ) {
            return fsk.group === $routeParams.section;
        };
    };

    $scope.headerGroup = function() {
        return function( fsk ) {
            return fsk.reference === $routeParams.section;
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


} );

fskApp.filter( 'flatten', function() {
    return function( obj ) {
        return obj.replace( /\s+/g, '-' ).toLowerCase();
    };
} );

fskApp.filter( 'cleaned', function() {
        return function( obj ) {
            if (obj) {
                return obj.toString().replace( /\,/g, '' );
            }
        };
} );

fskApp.filter('inArray', function() {
    return function(array, value) {
        if(array) {
            return array.indexOf(value) !== -1;
        }
    };
});


angular.module( "fskApp" ).directive( "fskComponent", function() {
    return {
        restrict: "E",
        templateUrl: "view/component-card.html"
    };
} );

angular.module( "fskApp" ).directive( "goBack", function() {
    return {
        restrict: "E",
        link: function( scope, elem ) {
            $( elem ).on( 'click', function() {
                $( '#searchText' ).val( '' );
            } );
        },
        template: "<div class='fsk-back'><button class='fsk-back-button' onclick='window.history.back()'><svg class='fsk-icon'><use xlink:href='#back' /></svg></button></div>"
    };
} );

angular.module("fskApp").directive("fskRipple", function() {
    return {
        restrict: "AC",
        link: function( scope, elem, attrs ) {

            var parent, ink, d, x, y;
            $(elem).click(function(e){
                if ($(elem).hasClass('fsk-btn')|| $(elem).hasClass('fsk-contain')) {
                    parent = $(elem);
                    } else {
                    parent = $(elem).parent();
                }
                if(parent.find(".fsk-ink").length === 0)
                    parent.prepend("<span class='fsk-ink'></span>");

                ink = parent.find(".fsk-ink");
                ink.removeClass("animate");

                //set size of .ink
                if(!ink.height() && !ink.width())
                {
                    d = Math.max(parent.outerWidth(), parent.outerHeight());
                    ink.css({height: d, width: d});
                }

                x = e.pageX - parent.offset().left - ink.width()/2;
                y = e.pageY - parent.offset().top - ink.height()/2;

                //set the position and add class .animate
                ink.css({top: y+'px', left: x+'px'}).addClass("animate");
            });
        }
    };
});

angular.module("fskApp").directive("fskAccordion", function() {
    return {
        restrict: "C",
        link: function( scope, elem, attrs ) {

                $(elem).on('click', function (e) {
                    //find clicked accordion trigger
                    var $trigger = $(e.target).closest('.fsk-accordion-trigger');
                    if ($(e.target).hasClass('fsk-accordion-trigger')) {
                        if ($trigger.hasClass('is-expanded')) {
                            $(elem).find('.is-triggered').removeClass('is-triggered').stop().slideUp(500);
                            $trigger.removeClass('is-expanded');
                        } else {
                            e.stopPropagation();
                            var $target = "." + $trigger.attr('data-target');
                            opener($trigger, $target);
                            }
                        }
                    });

            function opener(trigger, target) {
                $(elem).find('.is-triggered').removeClass('is-triggered').stop().slideUp(350);
                $(elem).find('.is-expanded').removeClass('is-expanded');
                $(target).addClass('is-triggered');
                trigger.addClass('is-expanded');
                $(elem).find(target).stop().slideDown(200);
            }
        }

    };
});

angular.module("fskApp").directive("fskOpen", function() {
    return {
        restrict: "C",
        link: function( scope, elem, attrs ) {

            $(elem).on('click', function () {
                var $target = $(this).attr('data-target');


                    if (!$(this).hasClass('is-triggered')) {
                        $('.fsk-content-area').find('.is-triggered').removeClass('is-triggered').stop().slideUp(350);
                        $('.fsk-content-area').find('.is-expanded').removeClass('is-expanded');
                        $('.fsk-sub-nav-heading').find('.is-triggered').removeClass('is-triggered');
                        $(this).addClass('is-triggered');
                        $('.fsk-content-area').find('[data-target="' + $target + '"]').addClass('is-expanded');
                        $("." + $target).addClass('is-triggered').stop().slideDown(350);
                    } else {
                        $(this).removeClass('is-triggered');
                        $('.fsk-content-area').find('[data-target="' + $target + '"]').removeClass('is-expanded');
                        $("." + $target).removeClass('is-triggered').stop().slideUp(350);
                    }
                });
        }
    };
});

angular.module("fskApp").directive("copyMarkup", function() {
    return {
        restrict: "A",
        link: function(scope, elem) {

            function whichAnimationEvent(){
                var t;
                var el = document.createElement('fakeelement');
                var animations = {
                  'animation':'animationend',
                  'OAnimation':'oAnimationEnd',
                  'MozAnimation':'animationend',
                  'WebkitAnimation':'webkitAnimationEnd'
                };

                for(t in animations){
                    if( el.style[t] !== undefined ){
                        return animations[t];
                    }
                }
            }


            var btn = elem[0];
            var input = btn.getElementsByTagName("textarea");
             btn.addEventListener("click", function(event) {
            var domelem = btn.parentElement;

              event.preventDefault();
              input[0].select(); // Select the input node's contents
              var succeeded;
              try {
                // Copy it to the clipboard
                succeeded = document.execCommand("copy");
              } catch (e) {
                succeeded = false;
              }
              if (succeeded) {
                domelem.classList.add("succeed");
                var animationEvent = whichAnimationEvent();
                animationEvent && domelem.addEventListener(animationEvent, function() {
                    domelem.classList.remove("succeed");
                });
              } else {
                domelem.classList.add("failed");
              }
            });
        }
    };
});

angular.module( "fskApp" ).directive( "searchInput", function( $interval ) {
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
            $( '.fsk-clear' ).on( 'click', function() {
                $( elem ).val( '' );
                window.location.hash = loc;
                $( elem ).removeClass( 'is-focused' );
            } );
        }
    };
} );

angular.module( 'fskApp' )
    .directive( 'shadowDom', function( fsk, $templateCache ) {

        var USER_STYLES_TEMPLATE = 'userStyles.html';

        return {
            restrict: 'E',
            transclude: true,
            link: function( scope, element, attrs, controller, transclude ) {

                scope.$watch( function() {
                    return fsk;
                }, function() {
                    if ( typeof element[ 0 ].createShadowRoot === 'function' && ( fsk && !fsk.disableEncapsulation ) ) {
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

angular.module( "fskApp" ).directive( 'stickyHeader', function() {
    return {
        restrict: 'A',
        link: function( scope, elem, attrs ) {
            var $element = $( '.fsk-main' ).css( 'right', '0' );
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

angular.module('fskApp').directive("fskScrollBars", function () {
   var res = {
     restrict : 'AC',
     link: function (scope, elem, attrs) {
            scope.$watch('$viewContentLoaded', function(event) {
               $( elem ).perfectScrollbar();
               $( elem ).perfectScrollbar('update');
            });
        }
     };
  return res;
});



angular.module( 'fskApp' ).directive( 'markdown', function() {
    var converter = new Showdown.converter({'strikethrough':true});
    return {
        restrict: 'E',
        link: function( scope, element, attrs ) {
            var htmlText = converter.makeHtml( element.text() );
            element.html( htmlText );
        }
    };
} );

angular.module( 'fskApp' ).directive( 'fskClorder', function() {
    return {
        restrict: 'A',
        link: function( scope, elem, attrs ) {
            $(elem).on('click', function () {
                var $reverse = $(this).next();
                if ($reverse.hasClass('fsk-reverse')) {
                    $reverse.removeClass('fsk-reverse');
                    $(this).text('newest first');
                } else {
                    $reverse.addClass('fsk-reverse');
                    $(this).text('oldest first');
                }
            });
        }
    };
} );

angular.module( "fskApp" ).directive( "svgIcon", function() {
    return {
        restrict: "EA",
        scope: {
            icon: '@'
        },
        template: "<svg class='fsk-icon fsk-svg-{{icon}}'><use xlink:href=''></use></svg>",
        link: function( scope, elem, attrs ) {
            $( elem ).find( 'use' ).attr( {
                'xlink:href': '#' + scope.icon
            } );
        }
    };
} );

fskApp.directive( 'ngPrism', [ '$compile', function( $compile ) {
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


angular.module( 'fskApp' ).service( "fsk", function( $http, $q ) {
    var fsk = $q.defer();
    $http.get( 'json/styleGuide.json' ).success( function( data ) {
        fsk.resolve( data );
    } );
    this.getStyles = function() {
        return fsk.promise;
    };
} );

angular.module( 'fskApp' ).service( "stats", function( $http, $q ) {
    var stats = $q.defer();
    $http.get( 'json/statGuide.json' ).success( function( data ) {
        stats.resolve( data );
    } );
    this.getStats = function() {
        return stats.promise;
    };
} );

angular.module( 'fskApp' ).service( "changelog", function( $http, $q ) {
    var changelog = $q.defer();
    $http.get( 'json/changeLog.json' ).success( function( data ) {
        changelog.resolve( data );
    } );
    this.getLog = function() {
        return changelog.promise;
    };
} );