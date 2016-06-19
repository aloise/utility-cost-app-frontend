Application.controller("DashboardController", ["$scope", "$http", "$state" , "places" , "globalStats",
        function ($scope, $http, $state, placesData, globalStatsData) {

            $scope.places = placesData.data.places;

            $scope.stats = globalStatsData.data.stats;
            /*
            {
                placesCount: 0,
                totalServices: 0,
                totalPaid:[ { currency : "USD", amount: 123 }, ... ],
                totalDebt:[ { currency : "USD", amount: 123 }, ... ]
            };
            */

        }
]);