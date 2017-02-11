'use strict';

angular.module('karyaApp')
    
    .controller('FeaturesController', ['$scope', 'productInfoService', function ($scope, productInfoService) {
        $scope.title = 'Features';
        $scope.data = productInfoService.getProductFeatures();

        $scope.showDetails = true;
        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('PlatformsController', ['$scope', 'productInfoService', function ($scope, productInfoService) {
        $scope.title = 'Platforms';
        $scope.data = productInfoService.getProductPlatforms();

        $scope.showDetails = true;
        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('SignupModalController', ['$scope', function ($scope) {
        $scope.signupData = {firstName: "", lastName: "", dateOfBirth: "", gender: "", tel: {areaCode: "", number: ""}, emailId: "", password: "" };
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];
        $scope.invalidGenderSelection = false;
        $scope.registeredEmailId = false;
    }])

    .controller('SignupController', ['$scope', 'userRegistrationService', function ($scope, userRegistrationService) {
        $scope.sendSignup = function (event) {
            console.log($scope.signupData);
            if ($scope.signupData.gender === "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
                event.preventDefault();
            } else {
                $scope.invalidGenderSelection = false;
                // TODO: Send to server for signup
                var registrationResponse = userRegistrationService.registerUser($scope.signupData);
                if (registrationResponse > 0) {
                    console.log('User registered with id: ' + registrationResponse);
                    // TODO: Switch to user home
                } else {
                    console.log('User registered disallowed due to: ' + registrationResponse);
                    $scope.registeredEmailId = true;
                    event.preventDefault();
                }
            }
        };
    }])

    .controller('LoginModalController', ['$scope', function ($scope) {
        $scope.authenticationCredentials = {emailid: "", password: "" };
        $scope.invalidCredentials = false;
    }])

    .controller('LoginController', ['$scope', 'userAuthenticationService', function ($scope, userAuthenticationService) {
        $scope.sendCredentials = function (event) {
            console.log($scope.authenticationCredentials);
            // Send to service for authentication
            var authenticationResponse = userAuthenticationService.authenticateUser($scope.authenticationCredentials);
            if (authenticationResponse) {
                console.log('User authenticated');
                // TODO: Switch to user home
            } else {
                $scope.invalidCredentials = true;
                $scope.authenticationCredentials = {emailid: "", password: "" };
                $scope.loginForm.$setPristine();
                event.preventDefault();
            }
        };
    }]);

