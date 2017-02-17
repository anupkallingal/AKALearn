'use strict';

angular.module('karyaApp')

    .constant("baseURL", "http://localhost:3000/")

    .factory('AuthenticationFactory', ['$resource', 'baseURL', 'ngDialog', function ($resource, baseURL, ngDialog) {
        var authFac;

        authFac = {};

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

        authFac.findUserWithCredentials = function (userCredentials, successFunction, errorFunction) {
            console.log("In findUserWithCredentials() of AuthenticationFactory: " + JSON.stringify(userCredentials));
            var User = $resource(baseURL + 'users', {'id': userCredentials.emailid, 'password': userCredentials.password});
            return User.query({'id': userCredentials.emailid, 'password': userCredentials.password},
                function (existingUser) {
                    console.log("In response to findUserWithCredentials() of AuthenticationFactory: " + JSON.stringify(existingUser));
                    if (existingUser.length === 1) {
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