(function() {
	'use strict';

	/* Init application */
	angular
		.module('app', [
			'ngAnimate',
			'ngRoute',
			'ngSanitize',
			'mgcrea.ngStrap',
			'uiGmapgoogle-maps',
			'angular-md5',
			'ngStorage'
		]);

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
        .service('commonService', commonService);

    commonService.$inject = ['$localStorage'];
    function commonService($localStorage) {

        var common = {
            isUserLogged: isUserLogged,
            logOut: logOut
        };

        function isUserLogged() {
            return typeof $localStorage.user !== 'undefined' && typeof $localStorage.user.name !== 'undefined' && $localStorage.user.name !== null;
        }

        function logOut() {
            if(isUserLogged()) {
                delete $localStorage.user;
            }
        }

        return common;
    }
})();
(function() {
    'use strict';

    angular
        .module('app')
        .controller('LogInCtrl', LogInCtrl);

    LogInCtrl.$inject = ['$scope', '$location', '$localStorage', 'MainService', 'commonService', 'md5'];
    function LogInCtrl($scope, $location, $localStorage, MainService, commonService, md5) {

        var vm = this;

        // Fields
        $scope.$storage = $localStorage;
        vm.userName = "";
        vm.password = "";
        vm.message = "";
        vm.cssClass = "";

        //Methods
        vm.login = login;

        function login() {
            var isValid = true;
            if(vm.userName === null || vm.userName === "") {
                isValid = false;
            }

            if(vm.password === null || vm.password === "") {
                isValid = false;
            }

            if(!isValid) {
                return;
            }

            var authenticateData = {};
            authenticateData.userName = vm.userName;
            authenticateData.password = md5.createHash(vm.password);

            MainService
                .authenticate(authenticateData)
                .then(onAuthenticateComplete, onAuthenticateError);
        }

        function onAuthenticateComplete(response) {
            if(response === null || response === "") {
                vm.message = "Credentialele nu corespund!";
                vm.cssClass = "error";
                return;
            }

            $scope.$storage.user = response;

            vm.message = "Salut " + $scope.$storage.user.name + " !";
            vm.cssClass = "";

            if(commonService.isUserLogged()) {
                $location.path("/home");
            }
        }

        function onAuthenticateError(response) {
            vm.message = "Credentialele nu corespund!";
            vm.cssClass = "error";
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('app')
        .controller('LogOutCtrl', LogOutCtrl);

    LogOutCtrl.$inject = ['$scope', '$location', '$localStorage', 'commonService'];
    function LogOutCtrl($scope, $location, $localStorage, commonService) {

        var vm = this;

        // Fields
        $scope.$storage = $localStorage;

        //Methods
        vm.logout = logout;

        activate();

        function activate() {
            logout();
        }

        function logout() {
            if(commonService.isUserLogged()) {
                commonService.logOut();
            }
            $location.path("/login");
        }
    }
})();
(function() {
	'use strict';

	angular
		.module('app')
		.controller('MainCtrl', MainCtrl);

	MainCtrl.$inject = ['$scope', '$localStorage'];
	function MainCtrl($scope, $localStorage) {

		var vm = this;
		$scope.$storage = $localStorage;

		vm.viewLocation = 'webapp/templates/main/main.html';

		return vm;
	}

})();
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
        vm.events = {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                vm.marker.coords = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
                vm.markers.push({latitude: e.latLng.lat(), longitude: e.latLng.lng()});
                var attributes = {};
                attributes.marker = {latitude: e.latLng.lat(), longitude: e.latLng.lng()};
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

                vm.marker = {
                    coords: {
                        latitude: 44.435730,
                        longitude: 26.048109
                    },
                    name: '',
                    description: '',
                    city: '',

                    key: 1,
                    events: {
                        click: function (gMarker, eventName, model) {
                              console.debug('mouseover');
                              vm.markerDetails = {};
                              vm.markerDetails = getMarkerDetails(model.coords);
                              model.doShow = true;
    //                          $scope.$apply();
                        },
                        rightclick : function (gMarker, eventName, model) {
                            //window.alert("Marker: lat: " + model.coords.latitude + ", lon: " + model.coords.longitude + " clicked!!")
                            removeMarker(model.coords.latitude, model.coords.longitude);
                            $scope.$apply();
                        }
                    }
                };

                vm.zoom = 15;

                getTheData();
            }
        }

           function getTheData(){
            MainService
               .getAllCoordinates()
               .then(onLoadComplete, onLoadError);

           }


        function onLoadComplete (response) {
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

        function addCoordinates() {
            var coordiates = {};
            coordiates.latitude =  vm.marker.coords.latitude;
            coordiates.longitude = vm.marker.coords.longitude;
            coordiates.name = vm.marker.name;
            coordiates.description = vm.marker.description;
            coordiates.city = vm.marker.city;

            MainService
                .addCoordinates(coordiates)
                .then(onAddComplete, onAddError);
        }

        function onAddComplete(response) {
            vm.message = "Datele au fost salvate cu succes in baza de date!";
            vm.cssClass = "ok";
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
(function() {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$localStorage'];
    function MenuController($scope, $localStorage) {

        var vm = this;
        $scope.$storage = $localStorage;
    }

})();
(function() {
    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$localStorage', 'MainService', 'md5', '$location', '$timeout'];
    function RegisterCtrl($scope, $localStorage, MainService, md5, $location, $timeout) {

        var vm = this;

        // Fields
        $scope.$storage = $localStorage;
        vm.form = {};
        vm.form.email = "";
        vm.form.name = "";
        vm.form.userName = "";
        vm.form.password = "";
        vm.form.age = "";
        vm.form.sex = "";

        vm.message = "";
        vm.cssClass = "";

        //Methods
        vm.register = register;

        activate();

        function activate() {
            resetForm();
        }

        function resetForm() {
            vm.form.email = "";
            vm.form.name = "";
            vm.form.userName = "";
            vm.form.password = "";
            vm.form.age = "";
            vm.form.sex = "";
        }

        function register() {
            var isValid = true;
            if(vm.form.email === null || vm.form.email === "") {
                isValid = false;
            }
            if(vm.form.name === null || vm.form.name === "") {
                isValid = false;
            }
            if(vm.form.userName === null || vm.form.userName === "") {
                isValid = false;
            }
            if(vm.form.password === null || vm.form.password === "") {
                isValid = false;
            }
            if(vm.form.age === null || vm.form.age === "") {
                isValid = false;
            }
            if(vm.form.sex === null || vm.form.sex === "") {
                isValid = false;
            }

            if(!isValid) {
                return;
            }

            vm.form.password = md5.createHash(vm.form.password);

            MainService
                .addUser(vm.form)
                .then(onAddComplete, onAddError);
        }

        function onAddComplete(response) {
            vm.message = "Utilizatorul a fost adaugat cu succes!";
            vm.cssClass = "ok";

            resetForm();

            $timeout(gotoLogin, 4000);
        }

        function onAddError() {
            vm.message = "A aparut o eroare la salvarea utilizatorului!";
            vm.cssClass = "error";
        }

        function gotoLogin() {
            $location.path("/login");
        }
    }
})();
(function() {
	'use strict';

	angular
		.module('app')
		.service('MainService', MainService);

	MainService.$inject = ['$http', '$q', '$location'];
	function MainService($http, $q, $location) {

		var service = {
			addCoordinates: addCoordinates,
			getAllCoordinates: getAllCoordinates,
			authenticate: authenticate,
			addUser: addUser
		};

		function addCoordinates(data) {
			return handleRequest('/coordinates/insert', data);
		}

		function getAllCoordinates() {
			return handleRequest('/coordinates/all');
		}

		function authenticate(data) {
			return handleRequest('/user/authenticate', data);
		}

		function addUser(data) {
			return handleRequest('/user/insert', data);
		}

		function handleRequest(url, data) {
			var deferred = $q.defer();

			$http
//				.post(getBaseURL() + url, data)
				.post("http://localhost:8090/mApp" + url, data)
				.success(function(data, status, headers, config) {
					deferred.resolve(data);
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);
				});

			return deferred.promise;
		}

		return service;
	}

//	function getBaseURL() {
//		var baseURL = $location.absUrl();
//
//		if (baseURL.lastIndexOf('/') == baseURL.length - 1) {
//			return baseURL.substring(0, baseURL.length - 1);
//		}
//
//		return baseURL;
//	}
	
})();
(function() {
    'use strict';
    
	angular
		.module('app')
		.config(Routes);
	
	Routes.$inject = ['$routeProvider'];
    function Routes($routeProvider) {

    	$routeProvider.
			when('/login', {
				templateUrl: 'pages/map/login.html',
				controller:	'LogInCtrl',
				controllerAs: 'login'
			}).
			when('/logout', {
				templateUrl: 'pages/map/logout.html',
				controller:	'LogOutCtrl',
				controllerAs: 'logout'
			}).
	    	when('/home', {
	    		templateUrl: 'pages/main/main.html',
	    		controller:	'MainCtrl',
	        	controllerAs: 'main'
	     	}).
			when('/map', {
				templateUrl: 'pages/map/map.html',
				controller:	'MapCtrl',
				controllerAs: 'map'
			}).
			when('/register', {
				templateUrl: 'pages/map/register.html',
				controller:	'RegisterCtrl',
				controllerAs: 'reg'
			}).
	    	otherwise({
	    		redirectTo: '/login'
			});
    }
    
})();