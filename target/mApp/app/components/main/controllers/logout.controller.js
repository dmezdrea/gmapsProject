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