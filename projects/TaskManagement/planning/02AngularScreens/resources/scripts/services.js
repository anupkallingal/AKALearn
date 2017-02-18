'use strict';

angular.module('karyaApp')

    .constant("baseURL", "http://localhost:3000/")

    .factory('$localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        };
    }])

    .factory('AuthenticationFactory', ['$rootScope', '$resource', '$http', '$localStorage', 'baseURL', 'ngDialog', function ($rootScope, $resource, $http, $localStorage, baseURL, ngDialog) {
        var authFac, TOKEN_KEY, isAuthenticated, username, authToken;
        authFac = {};
        TOKEN_KEY = 'Token';
        isAuthenticated = false;
        username = '';
        authToken = undefined;

        function useCredentials(credentials) {
            console.log("In useCredentials() of AuthenticationFactory: " + JSON.stringify(credentials));
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.token;

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function storeUserCredentials(credentials) {
            console.log("In storeUserCredentials() of AuthenticationFactory: " + JSON.stringify(credentials));
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;

            // Clear the header token
            $http.defaults.headers.common['x-access-token'] = authToken;

            // Clear entry in local storage
            $localStorage.remove(TOKEN_KEY);
        }

        authFac.register = function (registerData, successFunction, errorFunction) {
            // Set id to email id
            registerData.id = registerData.emailId;
            // Save data to server
            $resource(baseURL + "users")
                .save(registerData,
                    function (successResponse) {
                        console.log("In response to register() of AuthenticationFactory: " + successResponse);
                        successFunction(successResponse);
                    },
                    function (errorResponse) {
                        console.log("In response to register() of AuthenticationFactory: " + JSON.stringify(errorResponse));

                        var messageString;
                        if (errorResponse.status === -1) {
                            // The server may be down
                            messageString = "Unable to contact REST services. Please contact your administrators.";
                        } else if (errorResponse.status === 404) {
                            // Expected resource users not found on server
                            messageString = "Server facing technical difficulties. Please contact your administrators. Expected resource API for users not found.";
                        } else {
                            messageString = "Server facing technical difficulties. Please contact your administrators. Received response status " + errorResponse.status + " [" + errorResponse.statusText + "] from server.\n" + errorResponse.data;
                        }
                        errorFunction(messageString);
                    });
        };

        authFac.findUserWithId = function (id, successFunction, errorFunction) {
            var User = $resource(baseURL + 'users/:userId');
            return User.get({'userId': id},
                function (existingUser) {
                    console.log("In response to findUserWithId() of AuthenticationFactory: " + JSON.stringify(existingUser));
                    successFunction(existingUser);
                },
                function (errorResponse) {
                    console.log("In response to findUserWithId() of AuthenticationFactory: " + JSON.stringify(errorResponse));

                    var messageString;
                    if (errorResponse.status === 404) {
                        // Expected resource user not found on server
                        successFunction(null);
                        return;
                    } else if (errorResponse.status === -1) {
                        // The server may be down
                        messageString = "Unable to contact REST services. Please contact your administrators.";
                    } else {
                        messageString = "Server facing technical difficulties. Please contact your administrators. Received response status " + errorResponse.status + " [" + errorResponse.statusText + "] from server.\n" + errorResponse.data;
                    }
                    errorFunction(messageString);
                });
        };

        authFac.login = function (userCredentials, successFunction, errorFunction) {
            console.log("In login() of AuthenticationFactory: " + JSON.stringify(userCredentials));
            // TODO: Switch to proper authentication service
            var User = $resource(baseURL + 'users', {'id': userCredentials.emailid, 'password': userCredentials.password});
            User.query({'id': userCredentials.emailid, 'password': userCredentials.password},
                function (existingUser) {
                    console.log("In response to findUserWithCredentials() of AuthenticationFactory: " + JSON.stringify(existingUser));
                    if (existingUser.length === 1) {
                        storeUserCredentials({'username': existingUser[0].firstName, 'token': existingUser[0].lastName}); // TODO: LastName -> Token
                        $rootScope.$broadcast('login:Successful');
                        successFunction(existingUser[0]);
                    } else {
                        successFunction(null);
                    }
                },
                function (errorResponse) {
                    console.log("In response to findUserWithCredentials() of AuthenticationFactory: " + JSON.stringify(errorResponse));

                    var messageString;
                    if (errorResponse.status === 404) {
                        // Expected resource user not found on server
                        successFunction(null);
                        return;
                    } else if (errorResponse.status === -1) {
                        // The server may be down
                        messageString = "Unable to contact REST services. Please contact your administrators.";
                    } else {
                        messageString = "Server facing technical difficulties. Please contact your administrators. Received response status " + errorResponse.status + " [" + errorResponse.statusText + "] from server.\n" + errorResponse.data;
                    }
                    errorFunction(messageString);
                });
        };

        authFac.logout = function () {
            // TODO: Notify the server
            // $resource(baseURL + "users/logout").get(function (response) {});
            destroyUserCredentials();
        };

        authFac.isAuthenticated = function () {
            return isAuthenticated;
        };

        authFac.getUsername = function () {
            return username;
        };

        return authFac;
    }])

    .service('productInfoService', ['$resource', 'baseURL', function ($resource, baseURL) {
        this.getProductFeatures = function () {
            return $resource(baseURL + "productFeatures/:id", null,  {'update': {method: 'PUT' }});
        };
    
        this.getProductPlatforms = function () {
            return $resource(baseURL + "productPlatforms/:id", null,  {'update': {method: 'PUT' }});
        };
    }]);