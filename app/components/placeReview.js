/**
 * Created by aeon on 19/06/16.
 */
Application.controller("PlaceReviewController", ["$scope", "$http", "$state", "$stateParams", "$timeout", "place", "services", "bills",
    function ($scope, $http, $state, $stateParams, $timeout, placeData, servicesData, billsData) {

        $scope.place = placeData.data.place;

        $scope.services = servicesData.data.services;

        $scope.bills = billsData.data.bills;

        $scope.monthlyGroupedBills = [];
        
        $scope.currentYear = $stateParams.year ? parseInt($stateParams.year) : new Date().getFullYear();

        $scope.availableYears = [];

        $scope.addBillsForMonthData = {
            month: null
        };



        function getMonthName( created ) {
            return (created.getMonth() + 1) + "/" + created.getFullYear();
        };

        function transformBills() {

            $scope.availableYears = _.uniq(_.map($scope.bills, function (b) {
                return new Date(b.created).getFullYear();
            })).sort();

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
            var billsForMonth = _.findWhere($scope.monthlyGroupedBills, {"key": month + "/" + $scope.currentYear});
            var servicesToPay = _.indexBy(_.map($scope.services, function(s){
                var service = angular.copy(s);
                service.payed = false;
                service.readout = null;
                service.value = {};

                var startOfMonth = moment($scope.currentYear+"-"+month, "YYYY-MM");
                var lastPayedBillForService = _.last(
                    _.sortBy(
                        _.filter(
                            _.where($scope.bills, {"serviceId": service.id}), function (bill) {
                                return moment(bill.created).isBefore(startOfMonth);
                            })
                        , "created")
                );
                if(lastPayedBillForService){
                    service.lastPayedBill = lastPayedBillForService;
                }

                return service;
            }), "id");

            if(billsForMonth && !_.isEmpty(billsForMonth.value)){
                _.forEach(billsForMonth.value, function(bills){
                    var lastBillInMonth = _.last(bills);
                    if(lastBillInMonth && servicesToPay[lastBillInMonth.serviceId]){
                        servicesToPay[lastBillInMonth.serviceId].payed = true;
                        servicesToPay[lastBillInMonth.serviceId].readout = lastBillInMonth.readout;
                        servicesToPay[lastBillInMonth.serviceId].value = lastBillInMonth.value;

                    }
                });
            }

            $scope.addBillsForMonthData = {
                month: month,
                services: _.values(servicesToPay)
            };

            $timeout(function(){
                $("#addBillsForMonthModal").modal("show")
            });
        }

        transformBills();

        $scope.addBillsForMonth = addBillsForMonth;
        $scope.monthLabel = function( month, year){
            return month && year ? moment(month.toString(), "MM").format("MMM")+", " + year : "";
        }

        $scope.selectYear = function(year){
            $scope.currentYear = year;
            transformBills();
        }
    }
]);