'use strict';

// Declare app level module which depends on views, and components
var Application =
    angular.
        module('myApp', [ 'ui.router', "ngCookies" ]).
        config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $urlRouterProvider.otherwise("/login");
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "pages/login.html",
                    controller: "LoginController"
                })
                .state("main", {
                    templateUrl: "pages/main.html",
                    controller: "MainController",
                    resolve : {
                        places:  function($http, settings){
                            // $http returns a promise for the url data
                            return $http({method: 'GET', url: settings.baseURL + "/api/places"});
                        },
                        globalStats: function($http, settings){
                            return $http({method: 'GET', url: settings.baseURL + "/api/places/stats"});
                        }
                    }
                })
                .state('main.dashboard', {
                    url: "/dashboard",
                    templateUrl: "pages/dashboard.html",
                    controller: "DashboardController"
                })
                .state('main.placeReview',{
                    resolve : {
                        place: function ($http, settings, $stateParams) {
                            // $http returns a promise for the url data
                            return $http({method: 'GET', url: settings.baseURL + "/api/places/" + $stateParams.placeId});
                        },
                        services: function ($http, settings, $stateParams) {
                            // $http returns a promise for the url data
                            return $http({
                                method: 'GET',
                                url: settings.baseURL + "/api/places/" + $stateParams.placeId + "/services",
                                params: {includeInactive: 1}
                            });
                        },
                        bills: function ($http, settings, $stateParams) {
                            // $http returns a promise for the url data
                            var year = $stateParams.year ? parseInt( $stateParams.year ) : new Date().getFullYear();
                            var dateFrom = new Date(year, 0, 1);
                            var dateTo = new Date(year, 11, 31, 23, 59);
                            return $http({
                                method: 'GET',
                                url: settings.baseURL + "/api/places/" + $stateParams.placeId + "/bills",
                                params: {
                                    fromDate: dateFrom,
                                    toDate: dateTo
                                }
                            });
                        }
                    },
                    url:"/place/:placeId/:year?",
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