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