/**
 * Created by aeon on 19/06/16.
 */
Application.controller("PlaceReviewController", ["$scope", "$http", "$state" , "place" , "services", "bills",
    function ($scope, $http, $state, placeData, servicesData, billsData) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        $scope.bills = billsData.data.bills;

    }
]);