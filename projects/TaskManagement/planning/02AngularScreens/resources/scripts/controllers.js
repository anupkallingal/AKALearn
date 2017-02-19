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

    .controller('SignupController', ['$scope', 'AuthenticationFactory', '$state', 'ngDialog', function ($scope, AuthenticationFactory, $state, ngDialog) {
        $scope.signupData = {firstName: "", lastName: "", dateOfBirth: "", gender: "", tel: {areaCode: "", number: ""}, emailId: "", password: "" };
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];

        $scope.invalidGenderSelection = false;
        $scope.invalidRegisteredEmailEntry = false;
        $scope.displayWarningMessage = false;
        $scope.warningMessage = "";
        $scope.displayErrorMessage = false;
        $scope.errorMessage = "";

        $scope.sendSignup = function (event) {
            console.log($scope.signupData);

            $scope.displayErrorMessage = $scope.displayWarningMessage = $scope.invalidGenderSelection = $scope.invalidRegisteredEmailEntry = false;
            if ($scope.signupData.gender === null || $scope.signupData.gender === "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
                // TODO: event.preventDefault();
            } else {
                // Search for duplicate username/email id
                AuthenticationFactory.findUserWithId($scope.signupData.emailId,
                    function (user) {
                        // No user with submitted email id exists
                        if (user === null) {
                            // Send to server for signup
                            AuthenticationFactory.register($scope.signupData,
                                function (registeredData) {
                                    console.log('User registered: ' + registeredData);
                                    ngDialog.close();
                                    // Switch to user home
                                    $state.go('user', {}, {reload: true});
                                }, function (errorMessage) {
                                    console.log('Unable to register user due to: ' + errorMessage);
                                    $scope.displayErrorMessage = true;
                                    $scope.errorMessage = errorMessage;
                                    // TODO: event.preventDefault();
                                });
                        } else {
                            // username/email id is aready registered
                            var errorMessage = "The emailId " + $scope.signupData.emailId + " is already registered";
                            console.log(errorMessage);
                            $scope.displayErrorMessage = true;
                            $scope.errorMessage = errorMessage;
                            $scope.invalidRegisteredEmailEntry = true;
                            // TODO: event.preventDefault();
                        }
                    }, function (errorMessage) {
                        console.log('Unable to find user due to: ' + errorMessage);
                        $scope.displayErrorMessage = true;
                        $scope.errorMessage = errorMessage;
                        // TODO: event.preventDefault();
                    });

            }
        };
    }])

    .controller('LoginController', ['$scope', 'AuthenticationFactory', '$state', 'ngDialog', function ($scope, AuthenticationFactory, $state, ngDialog) {
        $scope.authenticationCredentials = {emailid: "", password: "" };
        $scope.displayWarningMessage = false;
        $scope.warningMessage = "";
        $scope.displayErrorMessage = false;
        $scope.errorMessage = "";

        $scope.doLogin = function () {
            console.log("Received crdentials: " + $scope.authenticationCredentials + " for authentication ");

            $scope.displayErrorMessage = $scope.displayWarningMessage = false;

            AuthenticationFactory.login($scope.authenticationCredentials,
                function (user) {
                    if (user !== null) {
                        // User is found
                        console.log('User authenticated: ' + user);
                        ngDialog.close();
                        // Switch to user home
                        $state.go('user', {}, {reload: true});
                    } else {
                        // No such user found
                        console.log("Incorrect login attempt with following credentials" + $scope.authenticationCredentials);
                        $scope.displayErrorMessage = true;
                        $scope.errorMessage = "Please check your email and password.";
                        // TODO: event.preventDefault();
                    }

                }, function (errorMessage) {
                    console.log('Unable to find user due to: ' + errorMessage);
                    $scope.displayErrorMessage = true;
                    $scope.errorMessage = errorMessage;
                    $scope.authenticationCredentials.password = "";
                    $scope.loginForm.$setPristine();
                    // TODO: event.preventDefault();
                });
        };

    }])

    .controller('HeaderController', ['$scope', '$rootScope', 'AuthenticationFactory', '$state', 'ngDialog', function ($scope, $rootScope, AuthenticationFactory, $state, ngDialog) {
        $scope.loggedIn = false;
        $scope.userName = '';
        $scope.displayName = '';

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.loggedIn = AuthenticationFactory.isAuthenticated();
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.displayName = AuthenticationFactory.getDisplayName();
        }

        $scope.openSignup = function () {
            ngDialog.open({ template: 'resources/views/signup.html', scope: $scope, className: 'ngdialog-theme-plain', controller: "SignupController", width: 600 });
        };
        $scope.openLogin = function () {
            ngDialog.open({ template: 'resources/views/login.html', scope: $scope, className: 'ngdialog-theme-plain', controller: "LoginController" });
        };
        $scope.logout = function () {
            AuthenticationFactory.logout();
            $scope.loggedIn = false;
            $scope.userName = '';
            $scope.displayName = '';
            $state.go('app', {}, {reload: true});
        };

        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthenticationFactory.isAuthenticated();
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.displayName = AuthenticationFactory.getDisplayName();
        });

        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };
    }])

    .controller('FooterController', ['$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
        $scope.stateis = function (curstate) {
            return $state.is(curstate);
        };
    }])

    .controller('UserController', ['$scope', '$rootScope', 'AuthenticationFactory', '$state', 'userInfoService', function ($scope, $rootScope, AuthenticationFactory, $state, userInfoService) {
        $scope.userName = '';
        $scope.shortName = '';
        $scope.showLists = false;
        $scope.message = "Loading ...";

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.shortName = AuthenticationFactory.getShortName();
        }

        $rootScope.$on('login:Successful', function () {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.shortName = AuthenticationFactory.getShortName();
        });

        userInfoService.getLists($scope.userName,
            function (response) {
                console.log("Ready with data to display" + JSON.stringify(response));
                $scope.data = response;
                $scope.showLists = true;
            },
            function (response) {
                $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
            });
    }]);

