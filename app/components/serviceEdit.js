/**
 * Created by aeon on 26/06/16.
 */
Application.controller("ServiceEditController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "settings",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, settings) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        function transformServices(){
            $scope.services = _.map($scope.services, function (service) {
                    if (service.serviceRate.rateData.ProgressiveRateData) {
                        var previousRate = null;
                        service.zippedRates = _.chain(service.serviceRate.rateData.ProgressiveRateData.rates).zip(service.serviceRate.rateData.ProgressiveRateData.prices).map(function(z){
                            var result = {rate:z[0], price:z[1]};
                            if(previousRate){
                                result.previousRate = previousRate;
                            }
                            previousRate = _.omit(result,"previousRate");
                            return result;
                        }).value();
                    }
                    return service;
                }
            );
        }

        transformServices();

    }]);