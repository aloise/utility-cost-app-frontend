
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


        var placeCurrency = placeData.data.place.currency;
        $scope.placeCurrency = placeCurrency;



        $scope.service = angular.copy( _.findWhere( servicesData.data.services, { id: parseInt( $stateParams.serviceId ) } ) );

        $scope.serviceFormData = angular.copy( $scope.service );

        $scope.serviceRateType = null;

        $scope.serviceRateData = { };

        initFormData( $scope.service.serviceRate );

        function initFormData( serviceRate ) {

            $scope.serviceRateType = _.keys( serviceRate.rateData )[0];

            var rateData = serviceRate.rateData[ $scope.serviceRateType ];

            switch( $scope.serviceRateType ) {
                case "FixedPriceRateData" :
                    $scope.serviceRateData = rateData;
                    break;
                case "ProgressiveRateData" :
                    $scope.serviceRateData.rates =
                        _.map(
                            _.zip( rateData.rates, rateData.prices ),
                            function( tuple ) {  return {  rate: tuple[0] , price: tuple[1] }  }
                        );
                    // { rates: [ { price: { amount: NUMBER, currency:STR }, rate: NUMBER } ] }
                    $scope.serviceRateData.exceedingPrice = rateData.exceedingPrice;

                    break;
                }
        }

        $scope.addRateRow = function(){
            $scope.serviceRateData.rates = $scope.serviceRateData.rates ? $scope.serviceRateData.rates : [];

            var minRate = _.last(  $scope.serviceRateData.rates );

            $scope.serviceRateData.rates.push({
                rate: minRate ? minRate.rate : 0,
                price: { amount: 0, currency: placeCurrency }
            });
        };

        $scope.removeRateRowAt = function (index) {

            $scope.serviceRateData.rates.splice( index, 1 );

        };

        $scope.updateServiceRate = function() {

            var data = {};

            switch( $scope.serviceRateType ) {
                case "ManualPriceRateData" :
                    data = { amount: { currency: placeCurrency, amount: 0 } };
                    break;

                case "FixedPriceRateData" :
                    data = $scope.serviceRateData;
                    data.amountPerMonth.currency = placeCurrency;
                    break;

                case "ProgressiveRateData" :
                    data.rates = _.map( $scope.serviceRateData.rates, function(item){ return item.rate } ) ;
                    data.prices = _.map( $scope.serviceRateData.rates, function(item){ return item.price } ) ;
                    data.exceedingPrice = $scope.serviceRateData.exceedingPrice;
                    data.exceedingPrice.currency = placeCurrency;
                    break;
            }

            var postRateData = {};
            postRateData[ $scope.serviceRateType ] = data;

            var serviceRateData = {
                serviceId: $scope.service.id,
                isActive: true,
                activeFromDate: new Date(),
                rateData: postRateData,
                isDeleted: false
            };


            $http.post( settings.baseURL + "/api/services/" + $scope.service.id + "/rates/update_active", serviceRateData ).
                then(function successCallback( serviceRateData ) {
                    // this callback will be called asynchronously
                    // when the response is available
                    var servicePostData = angular.copy( $scope.serviceFormData );
                    delete servicePostData.rateData;

                    $http.put( settings.baseURL + "/api/services", servicePostData ).
                    then(
                        function serviceSuccessCallback( serviceData ){

                            var serviceScopeData = serviceData.data.service;
                            serviceScopeData.serviceRate = serviceRateData.data.serviceRate;

                            var index = -1;
                            for( var i = 0; i < servicesData.data.services.length; i ++ ){
                                if( servicesData.data.services[i].id == serviceScopeData.id  ){
                                    servicesData.data.services[i] = serviceScopeData;
                                    index = i;
                                    break;
                                }
                            }

                            if( index >= 0 ){

                                $scope.service = serviceScopeData;

                                $scope.serviceFormData = angular.copy( $scope.service );

                                initFormData( $scope.service.serviceRate );
                            }

                        },
                        function serviceErrorCallback(){
                            // service failure
                        }
                    );
                
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });

        };





}]);