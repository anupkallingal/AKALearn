'use strict';

angular.module('karyaApp')
    
    .controller('ProductController', ['$scope', function ($scope) {
    }])

    .controller('CompanyController', ['$scope', function ($scope) {
    }])

    .controller('AboutUsController', ['$scope', function ($scope) {
    }])

    .controller('BlogsController', ['$scope', function ($scope) {
    }])

    .controller('ContactUsController', ['$scope', function ($scope) {
    }])

    .controller('FeaturesController', ['$scope', 'productInfoService', function ($scope, productInfoService) {
        $scope.title = 'Features';
        $scope.showFeatures = false;
        $scope.message = "Loading ...";
        productInfoService.getProductFeatures().query(
            function (response) {
                $scope.data = response;
                $scope.showFeatures = true;
            },
            function (response) {
                $scope.message = "Error while fetching features: " + response.status + " " + response.statusText;
            }
        );

        $scope.showDetails = true;
        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('PlatformsController', ['$scope', 'productInfoService', function ($scope, productInfoService) {
        $scope.title = 'Platforms';
        $scope.showPlatforms = false;
        $scope.message = "Loading ...";
        productInfoService.getProductPlatforms().query(
            function (response) {
                $scope.data = response;
                $scope.showPlatforms = true;
            },
            function (response) {
                $scope.message = "Error while fetching platforms: " + response.status + " " + response.statusText;
            }
        );

        $scope.showDetails = true;
        $scope.toggleDetails = function () {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('SignupController', ['$scope', 'userRegistrationService', 'ngDialog', function ($scope, userRegistrationService, ngDialog) {
        $scope.signupData = {firstName: "", lastName: "", dateOfBirth: "", gender: "", tel: {areaCode: "", number: ""}, emailId: "", password: "" };
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];

        $scope.invalidGenderSelection = false;
        $scope.displayWarningMessage = false;
        $scope.warningMessage = "";
        $scope.displayErrorMessage = false;
        $scope.errorMessage = "";

        $scope.sendSignup = function (event) {
            console.log($scope.signupData);

            $scope.displayErrorMessage = $scope.displayWarningMessage = $scope.invalidGenderSelection = false;
            if ($scope.signupData.gender === "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
                // TODO: event.preventDefault();
            } else {
                // TODO: Validate duplicate username/email id

                // Send to server for signup
                userRegistrationService.registerUser($scope.signupData,
                    function (registeredData) {
                        console.log('User registered: ' + registeredData);
                        ngDialog.close();
                        // TODO: Switch to user home
                    }, function (errorMessage) {
                        console.log('Unable to register user due to: ' + errorMessage);
                        $scope.displayErrorMessage = true;
                        $scope.errorMessage = errorMessage;
                        // TODO: event.preventDefault();
                    });
            }
        };
    }])

    .controller('LoginController', ['$scope', 'ngDialog', 'userAuthenticationService', function ($scope, ngDialog, userAuthenticationService) {
        $scope.authenticationCredentials = {emailid: "", password: "" };
        $scope.invalidCredentials = false;

        $scope.sendCredentials = function (event) {
            console.log($scope.authenticationCredentials);
            // Send to service for authentication
            var authenticationResponse = userAuthenticationService.authenticateUser($scope.authenticationCredentials);
            if (authenticationResponse) {
                console.log('User authenticated');
                // TODO: Switch to user home
                ngDialog.close();
            } else {
                $scope.invalidCredentials = true;
                $scope.authenticationCredentials.password = "";
                $scope.loginForm.$setPristine();
//                event.preventDefault();
            }
        };

    }])

    .controller('HeaderController', ['$scope', 'ngDialog', function ($scope, ngDialog) {
        $scope.openSignup = function () {
            ngDialog.open({ template: 'resources/views/signup.html', scope: $scope, className: 'ngdialog-theme-plain', controller: "SignupController", width: 600 });
        };
        $scope.openLogin = function () {
            ngDialog.open({ template: 'resources/views/login.html', scope: $scope, className: 'ngdialog-theme-plain', controller: "LoginController" });
        };
    }]);

