
/**
 * Created by aloise on 28/06/16.
 */
Application.controller("ServiceEditController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "settings",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, settings) {

        $scope.place = placeData.data.place;

        $scope.rateTypes = [
            { value: "ManualPriceRateData", label: "Arbitrary price every month"  },
            { value: "FixedPriceRateData", label: "Fixed price every month"  },
            { value: "ProgressiveRateData" , label: "Progressive rate cost"}
        ];


        $scope.service = angular.copy( _.findWhere( servicesData.data.services, { id: parseInt( $stateParams.serviceId ) } ) );
        $scope.serviceRateType = _.keys( $scope.service.rateData )[0];
        $scope.serviceRateData = {  };



}]);