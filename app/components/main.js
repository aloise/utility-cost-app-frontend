/**
 * Created by aeon on 19/06/16.
 */
Application.controller("MainController", ["$scope", "$http", "$state" , "places" , "globalStats",
    function ($scope, $http, $state, placesData, globalStatsData) {

        $scope.places = placesData.data.places;

        $scope.stats = globalStatsData.data.stats;

    }
]);