/**
 * Created by aloise on 03.07.16.
 */

Application.controller("PlaceEditController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "settings", "globalStats", "places",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, settings, globalStatsData, placesData) {

        $scope.place = placeData.data.place;

        $scope.placeFormData = angular.copy( placeData.data.place );
        
        $scope.currencies = _.values(settings.currencies);

        $scope.save = function(){

            $http.put( settings.baseURL + "/api/places", $scope.placeFormData ).then(
                function success(response){
                    $scope.place = response.data.place;
                    $scope.placeFormData = angular.copy( response.data.place );

                    placeData.data = response.data;

                    for( var i = 0; i < placesData.data.places.length; i ++){
                        if( placesData.data.places[i].id == $scope.place.id ){

                            placesData.data.places[i] = $scope.place;
                            break;
                        }
                    }

                },
                function failure(){

                }
            )

        };

        $scope.delete = function () {
            bootbox.confirm({
                title: "'" + $scope.place.title + "' place delete confirmation",
                message: "Are you sure want to delete this place?",
                callback: function (decision) {
                    if (decision) {
                        $http.delete(settings.baseURL + "/api/places/" + $scope.place.id)
                            .then(function (response) {
                                $state.transitionTo("main.dashboard", {}, {reload: true});
                            });
                    }
                }
            });
        };

    }
]);