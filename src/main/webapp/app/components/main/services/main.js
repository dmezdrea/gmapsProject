(function() {
	'use strict';

	angular
		.module('app')
		.service('MainService', MainService);

	MainService.$inject = ['$http', '$q', '$location'];
	function MainService($http, $q, $location) {

		var service = {
			addCoordinates: addCoordinates,
			deleteCoordinates: deleteCoordinates,
			getAllCoordinates: getAllCoordinates,
			authenticate: authenticate,
			addUser: addUser
		};


		function addCoordinates(data) {
			return handleRequest('/coordinates/insert', data);
		}

        function deleteCoordinates(data) {
            return handleDeleteRequest('/coordinates/delete', data);
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

        function handleDeleteRequest(url, data) {
            var deferred = $q.defer();
			var coord = data;
			delete coord.canDelete;
			delete coord.options;
            $http({
              method: 'DELETE',
              url: "http://localhost:8000/mApp" + url,
              data: coord,
              headers: {'Content-Type' : 'application/json'}
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                 deferred.resolve(data);
                 console.log("Success Service!");
              }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(data);
                console.log("Service" + response.status);
              });
//            $http
//                .delete("http://localhost:8090/mApp" + url, data)
//                .success(function(data, status, headers, config) {
//                    deferred.resolve(data);
//                })
//                .error(function(data, status, headers, config) {
//                    deferred.reject(data);
//                });

            return deferred.promise;
        }

		function handleRequest(url, data) {
			var deferred = $q.defer();

			$http
//				.post(getBaseURL() + url, data)
				.post("http://localhost:8000/mApp" + url, data)
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