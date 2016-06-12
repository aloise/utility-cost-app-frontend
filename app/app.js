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
                    url: "/dashboard",
                    templateUrl: "pages/dashboard.html",
                    controller: "DashboardController"
                });
    }]).run(["$rootScope", "$state", "$cookieStore", "$http", function ($rootScope, $state, $cookieStore, $http) {
        $rootScope.globals = $cookieStore.get("globals") || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common["Auth-Token"] = $rootScope.globals.currentUser.token;
        }
    
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, options) {
            if (toState.name != "login" && !$rootScope.globals.currentUser) {
                event.preventDefault();
                $state.go("login");
            }
        });
    
    }]);