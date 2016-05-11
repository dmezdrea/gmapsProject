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