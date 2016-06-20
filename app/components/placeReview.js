/**
 * Created by aeon on 19/06/16.
 */
Application.controller("PlaceReviewController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "bills",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, billsData) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        $scope.bills = billsData.data.bills;

        $scope.monthlyGroupedBills = [];
        
        $scope.currentYear = $stateParams.year ? parseInt($stateParams.year) : new Date().getFullYear()

        $scope.addBillsForMonthData = {
            month: null

        };



        function getMonthName( created ) {
            return (created.getMonth() + 1) + "/" + created.getFullYear();
        };

        function transformBills() {
            var groupedBills = _.groupBy($scope.bills, function (b) {
                var created = new Date(b.created);
                return getMonthName( created );
            });

            var months = [];
            for(var i=1; i<=12; i++) {
                var monthName = i + "/" + $scope.currentYear;
                var monthlyBills = groupedBills[monthName];
                var billsForService = _.groupBy(monthlyBills, "serviceId");
                var grouped = _.map($scope.services, function (service) {
                    return billsForService[service.id] || [];
                });
                months.push( {
                    month: i,
                    key: monthName,
                    value: grouped
                } );
            }

            $scope.monthlyGroupedBills = months;
        }

        function addBillsForMonth( month ) {
            $scope.addBillsForMonthData = {
                month: month
            };
            $timeout(function(){
                $("#addBillsForMonthModal").modal("show")

            });
        };

        transformBills();

        $scope.addBillsForMonth = addBillsForMonth;
        $scope.monthLabel = function( month, year){
            return month && year ? moment(month.toString(), "MM").format("MMM")+", " + year : "";
        }
    }
]);