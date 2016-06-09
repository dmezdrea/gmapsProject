(function() {
	'use strict';

	angular
		.module('app')
		.controller('ContactCtrl', ContactCtrl);

	ContactCtrl.$inject = ['$scope', '$localStorage'];
	function ContactCtrl($scope, $localStorage) {

		var vm = this;
		$scope.$storage = $localStorage;
	}

})();