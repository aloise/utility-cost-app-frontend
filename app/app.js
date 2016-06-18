'use strict';

// Declare app level module which depends on views, and components
var Application =
    angular.
        module('myApp', [ 'ui.router', "ngCookies" ]).
        config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/login");
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "pages/login.html",
                    controller: "LoginController"
                })
                .state('dashboard', {
                    resolve : {
                        places:  function($http, settings){
                            // $http returns a promise for the url data
                            return $http({method: 'GET', url: settings.baseURL + "/api/places"});
                        },
                        globalStats: function($http, settings){
                            return $http({method: 'GET', url: settings.baseURL + "/api/places/stats"});
                        }
                    },
                    url: "/dashboard",
                    templateUrl: "pages/dashboard.html",
                    controller: "DashboardController"
                })
                .state('placeReview',{
                    resolve : {
                        place: function ($http, settings, $stateParams) {
                            // $http returns a promise for the url data
                            return $http({method: 'GET', url: settings.baseURL + "/api/place/" + $stateParams.placeId});
                        }
                    },
                    url:"/place/:placeId",
                    templateUrl: "pages/place.html",
                    controller: "PlaceReviewController"


                });
    }]).run(["$rootScope", "$state", "$cookieStore", "$http", function ($rootScope, $state, $cookieStore, $http) {
        $rootScope.globals = $cookieStore.get("globals") || {};
        if ($rootScope.globals.user) {
            $http.defaults.headers.common["Auth-Token"] = $rootScope.globals.token;
        }
    
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, options) {
            if (toState.name != "login" && !$rootScope.globals.user) {
                event.preventDefault();
                $state.go("login");
            }
        });
    
    }]);