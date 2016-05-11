(function() {
    'use strict';

    angular
        .module('app')
        .controller('LogInCtrl', LogInCtrl);

    LogInCtrl.$inject = ['$scope', '$location', '$localStorage'];
    function LogInCtrl($scope, $location, $localStorage) {

        var vm = this;

        // Fields
        //$scope.$storage = $localStorage;

        //Methods
        vm.logout = logout;

        activate();

        function activate() {
            logout();
        }

        function logout() {
            //if(typeof $scope.$storage.user === 'undefined' || typeof $scope.$storage.user.name === 'undefined' || $scope.$storage.user.name === null) {
            //    $location.path("/logout");
            //}
        }
    }
})();