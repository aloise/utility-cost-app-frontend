Application.controller("DashboardController", ["$scope", "$http", "$state" , "places" , "globalStats",
        function ($scope, $http, $state, placesData, globalStatsData) {

            $scope.places = placesData.data.places;

            $scope.stats = globalStatsData.data.stats;
            /* {
                placesCount: 0,
                totalServices: 0,
                totalPaid:0,
                totalDebt:0
            };*/

        }
]);