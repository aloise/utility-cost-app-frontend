/**
 * Created by aeon on 26/06/16.
 */
Application.controller("ServicesController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "settings",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, settings) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        function transformServices(){
            $scope.services = _.map(servicesData.data.services, function (service) {
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

        $scope.detachService = function(service){
            bootbox.confirm({
                title:"'"+service.title+"' service detach confirmation",
                message: "Are you sure want to detach this service from "+ $scope.place.title + "?",
                callback: function(decision){
                    if(decision){
                        $http.delete(settings.baseURL+"/api/places/"+$scope.place.id+"/services/"+service.id)
                            .then(function successCallback(response){
                                for(var i=0;i<servicesData.data.services.length;i++){
                                    if(servicesData.data.services[i].id == service.id){
                                        servicesData.data.services.splice(i, 1);
                                        transformServices();
                                        break;
                                    }
                                }
                            });
                    }
                }
            });

        };

        transformServices();

    }]);