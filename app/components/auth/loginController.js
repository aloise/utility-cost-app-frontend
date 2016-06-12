/**
 * Created by aeon on 10/06/16.
 */

Application.controller("LoginController", ["$scope", "$http", "AuthService", function ($scope, $http, AuthService, $state) {

        AuthService.cleanCredentials();

        $scope.loginData = {};

        $scope.doLogin = function () {
            AuthService.Login($scope.loginData.email, $scope.loginData.password, function(user, token){
                $state.go("dashboard");
            });
        };

 }]);