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
                    abstract: true,
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
                .state('main.place',{
                    abstract: true,
                    template: "<ui-view/>",
                    resolve : {
                        place: function ($http, settings, $stateParams) {
                            return $http({method: 'GET', url: settings.baseURL + "/api/places/" + $stateParams.placeId});
                        },
                        services: function ($http, settings, $stateParams) {
                            return $http({
                                method: 'GET',
                                url: settings.baseURL + "/api/places/" + $stateParams.placeId + "/services",
                                params: {includeInactive: 1}
                            });
                        }
                    },
                    url:"/place/:placeId"

                })
                .state('main.place.review',{
                    url:"/review/:year?",
                    templateUrl: "pages/place.html",
                    controller: "PlaceReviewController",
                    resolve: {
                        bills: function ($http, settings, $stateParams) {
                            var dateTo = new Date();
                            return $http({
                                method: 'GET',
                                url: settings.baseURL + "/api/places/" + $stateParams.placeId + "/bills",
                                params: {
                                    toDate: dateTo
                                }
                            });
                        }
                    }
                })
                .state('main.place.services',{
                    url:"/services",
                    templateUrl: "pages/serviceEdit.html",
                    controller: "ServiceEditController"
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