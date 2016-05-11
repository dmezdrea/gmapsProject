(function() {
	'use strict';

	/* Init application */
	angular
		.module('app', ['ngAnimate', 'ngRoute', 'ngSanitize', 'mgcrea.ngStrap']);

	/* Common application conroller */
	angular
		.module('app')
		.controller('ApplicationCtrl', ApplicationCtrl);

	ApplicationCtrl.$inject = ['$window'];
	function ApplicationCtrl($window) {

		var vm = this;

	}
})();


(function() {
	'use strict';

	angular
		.module('app')
		.directive('sampleDirective', 	sampleDirective);
	
	function sampleDirective() {
	  return function(scope, element, attrs) {
	    scope.$watch(attrs.inputDisabled, function(val) {
	    	if (val === undefined)
	    		element.prop('disabled', false);
	    	else
	    		element.prop('disabled', true);
	    });
	  };
	}
	
})();
(function() {
	'use strict';

	angular
		.module('app')
		.controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['$window', 'MainService'];
	function MainCtrl($window, MainService) {

		var vm = this;

		vm.viewLocation = 'webapp/templates/main/main.html';

		return vm;
	}

})();
(function() {
    'use strict';

    angular
        .module('app')
        .controller('MapCtrl', MapCtrl);

    MapCtrl.$inject = ['$scope'];
    function MapCtrl($scope) {

        var vm = this;
        var waypointsArray = [];
        var markerStart = null;
        var markerStop = null;
        var directionsDisplay = new google.maps.DirectionsRenderer();;
        var directionsService = new google.maps.DirectionsService();
        var map = null;
        var route = null;

        function initialize() {

            var myLatLng = new google.maps.LatLng(44.435730, 26.048109);

            var mapOptions = {
                center: myLatLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
            });

            directionsDisplay.setMap(map);

            function placeMarker(location) {

                var marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    animation:google.maps.Animation.BOUNCE
                });

                if (markerStart == null) {
                    markerStart = marker;

                    return;
                }
                else if (markerStop == null) {

                    markerStop = marker;
                }
                else {

                    waypointsArray.push({location:markerStop.getPosition(), stopover:true} );
                    markerStop = marker;
                }

                calcRoute();
            }
        }

        google.maps.event.addDomListener(window, 'load', initialize);

        function calcRoute() {

            markerStart.setMap(null);
            markerStop.setMap(null);

            var request = {
                origin: markerStart.getPosition().toString(),
                destination: markerStop.getPosition().toString(),
                waypoints: waypointsArray,
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode.DRIVING
            };

            directionsService.route(request, function(response, status) {

                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    route = response.routes[0];
                    var summaryPanel = document.getElementById('directions_panel');
                    summaryPanel.innerHTML = '';
                    // For each route, display summary information.

                    var totalDistance = 0;

                    for (var i = 0; i < route.legs.length; i++) {

                        var routeSegment = i + 1;
                        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
                        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';

                        totalDistance += parseFloat(route.legs[i].distance.text.replace(",", "."));
                    }

                    summaryPanel.innerHTML += '<b>Total distance: ' + totalDistance.toFixed(1) + 'km</b><br>';
                }
            });
        }

        function exportToXML() {

            if (route != null) {

                var XML = document.createElement("XML");
                var Trip = document.createElement("Trip");
                var Route = document.createElement("Route");
                var TotalDistance = document.createElement("TotalDistance");
                var StartPoint = document.createElement("StartPoint");
                var EndPoint = document.createElement("EndPoint");
                var IntermediaryPoints = document.createElement("IntermediaryPoints");

                var intermediaryPointsRequired = false;

                Route.appendChild(StartPoint);
                Route.appendChild(EndPoint);

                var totalDistance = 0;

                for (var i = 0; i < route.legs.length; i++) {

                    if (StartPoint.innerHTML == "") {
                        StartPoint.innerHTML = route.legs[i].start_address;
                    }

                    if (EndPoint.innerHTML == "") {
                        EndPoint.innerHTML = route.legs[i].end_address;
                    }
                    else {
                        if (!intermediaryPointsRequired) {
                            Route.appendChild(IntermediaryPoints);
                            intermediaryPointsRequired = true;
                        }

                        var IntermediaryPoint = document.createElement("IntermediaryPoint");

                        IntermediaryPoint.innerHTML = EndPoint.innerHTML;
                        EndPoint.innerHTML = route.legs[i].end_address;

                        IntermediaryPoints.appendChild(IntermediaryPoint);
                    }

                    totalDistance += parseFloat(route.legs[i].distance.text.replace(",", "."));
                }

                TotalDistance.innerHTML = totalDistance.toFixed(1) + 'km';

                Trip.appendChild(Route);
                Trip.appendChild(TotalDistance);

                XML.appendChild(Trip);

                var downloadObject = document.createElement('a');
                downloadObject.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(XML.innerHTML));
                downloadObject.setAttribute('download', "HaiLaDrum.xml");
                downloadObject.click();
            }
        }
    }

})();
(function() {
	'use strict';

	angular
		.module('app')
		.service('MainService', MainService);

	MainService.$inject = ['$http'];
	function MainService($http) {

		var service = {};

		return service;
	}
	
})();
(function() {
    'use strict';
    
	angular
		.module('app')
		.config(Routes);
	
	Routes.$inject = ['$routeProvider'];
    function Routes($routeProvider) {

    	$routeProvider.
	    	 when('/', {
	    	   templateUrl: 'pages/main/main.html',
	    	   controller:	'MainCtrl',
	           controllerAs: 'main'
	       	 }).
			when('/map', {
				templateUrl: 'pages/map/map.html',
				controller:	'MapCtrl',
				controllerAs: 'map'
			}).
	         otherwise({
	           redirectTo: '/'
	         });
    }
    
})();