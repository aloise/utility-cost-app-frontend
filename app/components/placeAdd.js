/**
 * Created by aloise on 03.07.16.
 */


Application.controller("PlaceAddController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "settings", "globalStats", "places",
    function($scope, $http, $state, $stateParams, $timeout, settings, globalStats, placesData){

        $scope.placeFormData = {
            isDeleted: false
        };

        $scope.save = function(){

            $http.post( settings.baseURL + "/api/places", $scope.placeFormData ).then(
                function success(response){
                    $scope.placeFormData = response.data.place;

                    placesData.data.places.push( $scope.placeFormData );

                },
                function failure(){

                }
            )

        };

    }]
);
