'use strict';

angular.module('karyaApp')

    .constant("baseURL", "http://localhost:3000/")

    .factory('AuthenticationFactory', ['$resource', 'baseURL', 'ngDialog', function ($resource, baseURL, ngDialog) {
        var authFac;

        authFac = {};

        authFac.register = function (registerData, successFunction, errorFunction) {
            $resource(baseURL + "users")
                .save(registerData,
                    function (successResponse) {
                        console.log("In response to register() of AuthenticationFactory: " + successResponse);
                        successFunction(successResponse);
                    },
                    function (errorResponse) {
                        console.log("In response to register() of AuthenticationFactory: " + JSON.stringify(errorResponse));

                        var messageHTML, messageString;
                        if (errorResponse.status === -1) {
                            // The server may be down
                            messageString = "Unable to contact REST services. Please contact your administrators.";
                        } else if (errorResponse.status === 404) {
                            // Expected resource users not found on server
                            messageString = "Server facing technical difficulties. Please contact your administrators. Expected resource API for users not found.";
                        } else {
                            messageString = "Server facing technical difficulties. Please contact your administrators. Received response status " + errorResponse.status + " [" + errorResponse.statusText + "] from server.";
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
    }])

    .service('userRegistrationService', ['AuthenticationFactory', function (AuthenticationFactory) {

        this.registerUser = function (userInfo, successFunction, errorFunction) {
            console.log("In registerUser () of userRegistrationService: " + userInfo);
            // TODO Validate emailId

            // Submit user info
            userInfo.id = userInfo.emailId;
            AuthenticationFactory.register(userInfo, successFunction, errorFunction);

            // return user Info
            return userInfo;
        };
    }])

    .service('userAuthenticationService', function () {

        this.authenticateUser = function (userCredentials) {
            console.log("In authenticateUser () of userAuthenticationService: " + userCredentials);
            // TODO Authenticate user credentials
            // return user id
            return false;
        };
    });