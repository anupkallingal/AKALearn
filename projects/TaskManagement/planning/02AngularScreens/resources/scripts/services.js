'use strict';

angular.module('karyaApp')

    .constant("baseURL", "http://localhost:3000/")

    .service('productInfoService', ['$http', 'baseURL', function ($http, baseURL) {
        this.getProductFeatures = function () {
            return $http.get(baseURL + "productFeatures");
        };
    
        this.getProductPlatforms = function () {
            return $http.get(baseURL + "productPlatforms");
        };
    }])

    .service('userRegistrationService', function () {

        this.registerUser = function (userInfo) {
            console.log("In registerUser () of userRegistrationService: " + userInfo);
            // TODO Validate user info
            // TODO Submit user info
            // return user id
            return -1;
        };
    })

    .service('userAuthenticationService', function () {

        this.authenticateUser = function (userCredentials) {
            console.log("In authenticateUser () of userAuthenticationService: " + userCredentials);
            // TODO Authenticate user credentials
            // return user id
            return false;
        };
    });