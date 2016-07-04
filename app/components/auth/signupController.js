/**
 * Created by aeon on 04/07/16.
 */
Application.controller("SignupController", ["$scope", "$http", "AuthService", "$state", "settings", function ($scope, $http, AuthService, $state, settings) {
    console.log("SignupController");
    AuthService.cleanCredentials();

    $scope.error = false;

    $scope.formDisabled = false;

    $scope.signupData = {
        created: new Date(),
        isDeleted: false
    };

    $scope.doSignup = function () {
        $scope.formDisabled = true;
        $http.post(settings.baseURL + "/api/users", $scope.signupData)
            .then(function (response) {
                $scope.formDisabled = false;
                AuthService.setCredentials(response.data.user, response.data.token);
                $state.go("main.dashboard");
            });
    };

}]);