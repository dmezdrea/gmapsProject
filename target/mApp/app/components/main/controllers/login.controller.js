(function() {
    'use strict';

    angular
        .module('app')
        .controller('LogInCtrl', LogInCtrl);

    LogInCtrl.$inject = ['$scope', '$location', '$localStorage', 'MainService', 'md5'];
    function LogInCtrl($scope, $location, $localStorage, MainService, md5) {

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

            //$scope.$storage.user = response;

            vm.message = "Salut " + $scope.$storage.user.name + " !";
            vm.cssClass = "";

            //if(typeof $scope.$storage.user !== 'undefined' && typeof $scope.$storage.user.name !== 'undefined' && $scope.$storage.user.name !== null) {
            //    $location.path("/home");
            //}
        }

        function onAuthenticateError(response) {
            vm.message = "Credentialele nu corespund!";
            vm.cssClass = "error";
        }
    }
})();