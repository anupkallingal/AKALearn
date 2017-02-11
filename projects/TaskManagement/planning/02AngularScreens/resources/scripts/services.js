'use strict';

angular.module('karyaApp')

    .service('productInfoService', function () {
        var productFeatures, productPlatforms;
        
        productFeatures = [
            {name: 'Organize Tasks', description: 'Add, organize and manage tasks in an easy way.', image: 'resources/images/Organize.png'},
            {name: 'Access Anywhere', description: 'Accessible on web and multiple mobile platforms.', image: 'resources/images/Anywhere.png'},
            {name: 'Search', description: 'Easily search for tasks based on filters', image: 'resources/images/Search.png'},
            {name: 'Protection', description: 'Protect your task for unauthorized access', image: 'resources/images/Protection.png'},
            {name: 'Notes', description: 'Add notes to keep everything together', image: 'resources/images/Notes.png'},
            {name: 'Schedule', description: 'Schedule commencement of work on task.', image: 'resources/images/Schedule.png'},
            {name: 'Set status', description: 'Mark status of tasks e.g. \"In Progress\" or \"Complete\"', image: 'resources/images/Status.png'},
            {name: 'Lists', description: 'Keep related tasks and projects together e.g. based on location, client etc.', image: 'resources/images/List.png'},
            {name: 'Tags', description: 'Manage your tags, assign them to tasks and quickly find tagged tasks', image: 'resources/images/Tags.png'}
        ];
        
        productPlatforms = [
            {name: 'Web', description: 'Access your tasks through the web', iconClass: 'fa-laptop', availability: ''},
            {name: 'Android Mobile and Tabs', description: 'Access your tasks through Android phone and tabs', iconClass: 'fa-android', availability: 'Soon'},
            {name: 'iPhone', description: 'Access your tasks through iPhones', iconClass: 'fa-apple', availability: 'Soon'},
            {name: 'Windows Mobile and Tabs', description: 'Access your tasks through Windows mobile and tabs', iconClass: 'fa-windows', availability: 'Soon'}
        ];
    
        this.getProductFeatures = function () {
            return productFeatures;
        };
    
        this.getProductPlatforms = function () {
            return productPlatforms;
        };
    })

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