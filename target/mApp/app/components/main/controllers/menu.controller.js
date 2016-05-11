(function() {
    'use strict';

    angular
        .module('app')
        .controller('MenuController', MenuController);

    MenuController.$inject = ['$scope', '$localStorage'];
    function MenuController($scope, $localStorage) {

        var vm = this;
        //$scope.$storage = $localStorage;
    }

})();