(function() {
    'use strict';

    angular
        .module('app')
        .controller('MapCtrl', MapCtrl);

    MapCtrl.$inject = ['$scope', '$location', '$localStorage', 'MainService', 'commonService'];
    function MapCtrl($scope, $location, $localStorage, MainService, commonService) {

        var vm = this;

        //Constants

        //Fields
        $scope.$storage = $localStorage;
        vm.center = {
            latitude: 44.435730,
            longitude: 26.048109
        };
        vm.zoom = 15;
        vm.marker = {};
        vm.activeMarker = {};
        vm.events = {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                vm.markers.push({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
                var attributes = {};
                attributes.marker = {latitude: e.latLng.lat(), longitude: e.latLng.lng(), id: -1};
                attributes.canDelete = true;
                vm.markersAttributes.push(attributes);
                $scope.$apply();
            }
        };

        vm.markers = [];
        vm.markersAttributes = [];

        vm.markerDetails = {};

        vm.message = "";
        vm.cssClass = "ok";

        //Methods
        vm.addCoordinates = addCoordinates;

        activate();

        function activate() {
            if(!commonService.isUserLogged()) {
                $location.path("/login");
            } else {
                vm.center = {
                    latitude: 44.435730,
                    longitude: 26.048109
                };
                vm.zoom = 15;
                vm.active = {};
                vm.mapOptions = {
                    addCoordinates: addCoordinates
                };

                $scope.$root.addCoordinates = addCoordinates;

                vm.marker = {
                    key: 1,
                    events: {
                        click: function (gMarker, eventName, model) {
                              vm.active =  getMarkerDetails(model.coords);
                               model.doShow = true;
                        },
                        rightclick : function (gMarker, eventName, model) {
                            removeMarker(model.coords.latitude, model.coords.longitude);
                            $scope.$apply();
                        }
                    }
                };
                getTheData();
            }
        }

           function getTheData(){
            MainService
               .getAllCoordinates()
               .then(onLoadComplete, onLoadError);

           }


        function onLoadComplete (response) {
            vm.cssClass = "";
            vm.markers = [];
            vm.markersAttributes = [];
            if(response.length > 0) {
                var marker = {};
                var attributes = {};
                for (var i = 0; i < response.length; i++) {
                    marker = {};
                    attributes = {};
//                    marker.latitude = response[i].latitude;
//                    marker.longitude = response[i].longitude;

                    vm.markers.push(response[i]);

                    attributes.marker = response[i];
                    attributes.canDelete = false;
                    vm.markersAttributes.push(attributes);
                }
            } else {
                vm.markers = [
                    {
                        latitude: 44.435730,
                        longitude: 26.048109
                    }
                ];
                var attributes = {};
                attributes.marker = vm.markers[0];
                attributes.canDelete = true;
                vm.markersAttributes.push(attributes);
            }

        }

        function onLoadError(response) {

        }

        function addCoordinates(who) {
        //who - contine ce vrem sa adaugam
        // vm.markers - contine tot ce avem pana acum
            MainService
                .addCoordinates(who)
                .then(onAddComplete, onAddError);
        }

        function onAddComplete(response) {
            vm.message = "Datele au fost salvate cu succes in baza de date!";
            vm.cssClass = "dataAdded";
            $scope.$apply();

            getTheData();
        }

        function onAddError() {
            vm.message = "A aparut o eroare la salvarea datelor in baza de date!";
            vm.cssClass = "error";
        }

        function removeMarker(latitude, longitude) {
            var index = -1;
            for(var i = 0; i < vm.markers.length; i++) {
                if(vm.markers[i].latitude === latitude && vm.markers[i].longitude === longitude) {
                    index = i;
                }
            }

            if(index != -1 && vm.markersAttributes[index].canDelete) {
                vm.markers.splice(index, 1);
                vm.markersAttributes.splice(index, 1);
            }
        }

        function getMarkerDetails(coordinates) {
            var latitude = coordinates.latitude;
            var longitude = coordinates.longitude;
            for(var i = 0; i < vm.markersAttributes.length; i++) {
                if(vm.markersAttributes[i].marker.latitude === latitude && vm.markersAttributes[i].marker.longitude === longitude) {
                    return vm.markersAttributes[i];
                }
            }
            return null;
        }

    }
})();