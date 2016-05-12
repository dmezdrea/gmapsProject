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