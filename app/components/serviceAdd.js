/**
 * Created by aeon on 03/07/16.
 */
Application.controller("ServiceAddController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "settings",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, settings) {

        $scope.place = placeData.data.place;

        $scope.rateTypes = [
            {value: "ManualPriceRateData", label: "Arbitrary price every month"},
            {value: "FixedPriceRateData", label: "Fixed price every month"},
            {value: "ProgressiveRateData", label: "Progressive rate cost"}
        ];

        $scope.searchServicesURL = settings.baseURL + "/api/services/lookup";

        var placeCurrency = placeData.data.place.currency;
        $scope.placeCurrency = placeCurrency;

        $scope.serviceSearchRequestFormatter = function (s) {
            return {filter: s, limit: 10};
        };

        $scope.service = {};

        $scope.attachService = function (service) {
            $scope.selectedService = null;
            $http.post(settings.baseURL + "/api/places/" + $scope.place.id + "/services/" + service.id)
                .then(function () {
                    $http.get(settings.baseURL + "/api/services/" + service.id)
                        .then(function (response) {
                            servicesData.data.services.push(response.data.service);
                            $state.go("main.place.services", {placeId: $scope.place.id});
                        })
                });
        }
    }]);