/**
 * Created by aeon on 19/06/16.
 */
Application.controller("PlaceReviewController", ["$scope", "$http", "$state", "place", "services", "bills",
    function ($scope, $http, $state, placeData, servicesData, billsData) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        $scope.bills = billsData.data.bills;

        $scope.monthlyGroupedBills = [];

        function transformBills() {
            var groupedBills = _.groupBy($scope.bills, function (b) {
                var created = new Date(b.created);
                return (created.getMonth() + 1) + "/" + created.getFullYear();
            });

            var months = _.keys(groupedBills);

            _.forEach(months, function (m) {
                var monthlyBills = groupedBills[m];
                var billsForService = _.groupBy(monthlyBills, "serviceId");
                groupedBills[m] = _.map($scope.services, function (service) {
                    return billsForService[service.id] || [];
                })
            });

            $scope.monthlyGroupedBills = groupedBills
        }

        transformBills();

    }
]);