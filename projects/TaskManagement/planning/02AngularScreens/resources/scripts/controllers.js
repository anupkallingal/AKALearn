'use strict';

angular.module('karyaApp')
    
    .controller('FeaturesController', ['$scope', 'productInfoService', function($scope, productInfoService) {
        $scope.title = 'Features';
        $scope.data = productInfoService.getProductFeatures();

        $scope.showDetails = true;
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('PlatformsController', ['$scope', 'productInfoService', function($scope, productInfoService) {
        $scope.title = 'Platforms';
        $scope.data = productInfoService.getProductPlatforms();

        $scope.showDetails = true;
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('SignupModalController', ['$scope', function ($scope) {
        $scope.signupData = {firstName: "", lastName: "", dateOfBirth: "", gender: "", tel: {areaCode: "", number: ""}, emailId: "", password: "" };
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];
        $scope.invalidGenderSelection = false;

    }])

    .controller('SignupController', ['$scope', 'userRegistrationService', function ($scope, userRegistrationService) {
        $scope.sendSignup = function () {
            console.log($scope.signupData);
            if ($scope.signupData.gender === "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
            } else {
                $scope.invalidGenderSelection = false;
                // TODO: Send to server for signup
                userRegistrationService.registerUser($scope.signupData);
                // TODO: Switch to user home
                $scope.signupData = {firstName: "", lastName: "", dateOfBirth: 0, gender: "male", tel: {areaCode: "", number: ""}, emailId: "", password: "" };
                $scope.loginForm.$setPristine();
                console.log($scope.signupData);
            }
        };
    }])

    .controller('LoginModalController', ['$scope', function($scope) {
        $scope.authenticationCredentials = {emailid:"", password:"" };
    }])

    .controller('LoginController', ['$scope', function($scope) {
        $scope.sendCredentials = function() {
            console.log($scope.authenticationCredentials);
            // TODO: Send to server for authentication
            // TODO: Switch to user home
            $scope.authenticationCredentials = {emailid:"", password:"" };
            $scope.loginForm.$setPristine();
            console.log($scope.authenticationCredentials);
        };
    }]);

