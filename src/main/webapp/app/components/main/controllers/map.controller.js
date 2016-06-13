(function() {
    'use strict';

    angular
        .module('app')
        .controller('MapCtrl', MapCtrl);

    MapCtrl.$inject = ['$scope', '$location', '$localStorage', 'MainService', 'commonService', '$filter'];
    function MapCtrl($scope, $location, $localStorage, MainService, commonService, $filter) {

        var vm = this;

        //Constants
        $scope.config = {};
$scope.config.theIcons = {
"accountancy":{
    "label": "Accountancy",
    "path":"images/map-icons/accountancy.png"
},
"arts-crafts":{
    "label": "Arts-crafts",
    "path":"images/map-icons/arts-crafts.png"
},
"astrology":{
    "label": "Astrology",
    "path":"images/map-icons/astrology.png"
},
"automotive":{
"label": "Automotive",
"path":"images/map-icons/automotive.png"
},
"bars":{
"label": "Bars",
"path":"images/map-icons/bars.png"
},
"birds":{
"label": "Birds",
"path":"images/map-icons/birds.png"
},
"books-media":{
"label": "Books-media",
"path":"images/map-icons/books-media.png"
},
"breakfast-n-brunch":{
"label": "Breakfast-n-brunch",
"path":"images/map-icons/breakfast-n-brunch.png"
},
"business":{
"label": "Business",
"path":"images/map-icons/business.png"
},
"cake-shop":{
"label": "Cake-shop",
"path":"images/map-icons/cake-shop.png"
},
"clothings":{
"label": "Clothings",
"path":"images/map-icons/clothings.png"
},
"clubs.png":{
"label": "Clubs.png",
"path":"images/map-icons/clubs.png"
},
"coffee-n-tea":{
"label": "Coffee-n-tea",
"path":"images/map-icons/coffee-n-tea.png"
},
"commercial-places":{
"label": "Commercial-places",
"path":"images/map-icons/commercial-places.png"
},
"community":{
"label": "Community",
"path":"images/map-icons/community.png"
},
"computers":{
"label": "Computers",
"path":"images/map-icons/computers.png"
},
"concerts":{
"label": "Concerts",
"path":"images/map-icons/concerts.png"
},
"cookbooks":{
"label": "Cookbooks",
"path":"images/map-icons/cookbooks.png"
},
"dance-clubs":{
"label": "Dance-clubs",
"path":"images/map-icons/dance-clubs.png"
},
"default":{
"label": "Default",
"path":"images/map-icons/default.png"
},
"dental":{
"label": "Dental",
"path":"images/map-icons/dental.png"
},
"doctors":{
"label": "Doctors",
"path":"images/map-icons/doctors.png"
},
"education":{
"label": "Education",
"path":"images/map-icons/education.png"
},
"electronics":{
"label": "Electronics",
"path":"images/map-icons/electronics.png"
},
"employment":{
"label": "Employment",
"path":"images/map-icons/employment.png"
},
"engineering":{
"label": "Engineering",
"path":"images/map-icons/engineering.png"
},
"entertainment":{
"label": "Entertainment",
"path":"images/map-icons/entertainment.png"
},
"event":{
"label": "Event",
"path":"images/map-icons/event.png"
},
"exhibitions":{
"label": "Exhibitions",
"path":"images/map-icons/exhibitions.png"
},
"fashion":{
"label": "Fashion",
"path":"images/map-icons/fashion.png"
}


}




$scope.config.filters = {mine: false};



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
                vm.markers.push({"latitude": e.latLng.lat(), "longitude": e.latLng.lng()});
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
        vm.activeFilter = {"owner": ($scope.config.filters.mine ? $scope.$storage.user.userName:"")};
        vm.addCoordinates = addCoordinates;
        vm.applyFilters = function(){
            vm.activeFilter.owner = $scope.config.filters.mine ? $scope.$storage.user.userName:"";
            vm.markers = $filter('filter')(vm.markersBackup, vm.activeFilter);
        };

        vm.toggleFilter = function(key){
            //if(typeof vm.activeFilter[key] != "undefined"){
            //    delete vm.activeFilter[key];
            //}else{
            //    vm.activeFilter[key] = true;
            //}
            if(vm.activeFilter["icon"] == key){
                vm.activeFilter["icon"] = "";
            }else{
                vm.activeFilter["icon"] = key;
            }



            vm.applyFilters();
        };


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

        $scope.$root.deleteCoordinates = deleteCoordinates;
        $scope.$root.addCoordinates = addCoordinates;

        function deleteCoordinates(who){
                MainService
                    .deleteCoordinates(who)
                    .then(function(){
                        getTheData();
                        //console.log("complete");
                    },function(error){
                    //console.log("error!")
                    });
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
                    response[i].options = {"icon": $scope.config.theIcons[response[i].icon && response[i].icon || "event"].path}
                    response[i].canDelete = $scope.$storage.user.userName == response[i].owner || $scope.$storage.user.status.type == "admin";
                    vm.markers.push(response[i]);

                    attributes.marker = response[i];
                    attributes.canDelete = false;
                    vm.markersAttributes.push(attributes);
                }
            }

            vm.markersBackup = JSON.parse(JSON.stringify(vm.markers));
            vm.applyFilters();
        }

        function onLoadError(response) {

        }

        function addCoordinates(who) {
        //who - contine ce vrem sa adaugam
        // vm.markers - contine tot ce avem pana acum
        who.owner = $scope.$storage.user.userName;
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