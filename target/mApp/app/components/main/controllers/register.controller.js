(function() {
    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['$scope', '$localStorage', 'MainService', 'md5'];
    function RegisterCtrl($scope, $localStorage, MainService, md5) {

        var vm = this;

        // Fields
        //$scope.$storage = $localStorage;
        vm.form = {};
        vm.form.email = "";
        vm.form.name = "";
        vm.form.userName = "";
        vm.form.password = "";
        vm.form.age = "";
        vm.form.sex = "";

        vm.message = "";
        vm.cssClass = "";

        //Methods
        vm.register = register;

        activate();

        function activate() {
            resetForm();
        }

        function resetForm() {
            vm.form.email = "";
            vm.form.name = "";
            vm.form.userName = "";
            vm.form.password = "";
            vm.form.age = "";
            vm.form.sex = "";
        }

        function register() {
            var isValid = true;
            if(vm.form.email === null || vm.form.email === "") {
                isValid = false;
            }
            if(vm.form.name === null || vm.form.name === "") {
                isValid = false;
            }
            if(vm.form.userName === null || vm.form.userName === "") {
                isValid = false;
            }
            if(vm.form.password === null || vm.form.password === "") {
                isValid = false;
            }
            if(vm.form.age === null || vm.form.age === "") {
                isValid = false;
            }
            if(vm.form.sex === null || vm.form.sex === "") {
                isValid = false;
            }

            if(!isValid) {
                return;
            }

            vm.form.password = md5.createHash(vm.form.password);

            MainService
                .addUser(vm.form)
                .then(onAddComplete, onAddError);
        }

        function onAddComplete(response) {
            vm.message = "Utilizatorul a fost adaugat cu succes!";
            vm.cssClass = "ok";
        }

        function onAddError() {
            vm.message = "A aparut o eroare la salvarea utilizatorului!";
            vm.cssClass = "error";
        }
    }
})();