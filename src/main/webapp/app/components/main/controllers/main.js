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