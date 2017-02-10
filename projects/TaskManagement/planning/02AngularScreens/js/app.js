'use strict';

angular.module('karyaApp', [])
    
    .controller('FeaturesController', ['$scope', function($scope) {
        $scope.title = 'Features';
        $scope.data = [
                {name:'Organize Tasks', description:'Add, organize and manage tasks in an easy way.', image:'images/Organize.png'},
                {name:'Access Anywhere', description:'Accessible on web and multiple mobile platforms.', image:'images/Anywhere.png'},
                {name:'Search', description:'Easily search for tasks based on filters', image:'images/Search.png'},
                {name:'Protection', description:'Protect your task for unauthorized access', image:'images/Protection.png'},
                {name:'Notes', description:'Add notes to keep everything together', image:'images/Notes.png'},
                {name:'Schedule', description:'Schedule commencement of work on task.', image:'images/Schedule.png'},
                {name:'Set status', description:'Mark status of tasks e.g. \“In Progress” or “Complete\”', image:'images/Status.png'},
                {name:'Lists', description:'Keep related tasks and projects together e.g. based on location, client etc.', image:'images/List.png'},
                {name:'Tags', description:'Manage your tags, assign them to tasks and quickly find tagged tasks', image:'images/Tags.png'}
            ];

        $scope.showDetails = true;
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('PlatformsController', ['$scope', function($scope) {
        $scope.title = 'Platforms';
        $scope.data = [
                {name:'Web', description:'Access your tasks through the web', iconClass:'fa-laptop', availability:''},
                {name:'Android Mobile and Tabs', description:'Access your tasks through Android phone and tabs', iconClass:'fa-android', availability:'Soon'},
                {name:'iPhone', description:'Access your tasks through iPhones', iconClass:'fa-apple', availability:'Soon'},
                {name:'Windows Mobile and Tabs', description:'Access your tasks through Windows mobile and tabs', iconClass:'fa-windows', availability:'Soon'}
            ];

        $scope.showDetails = true;
        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('SignupModalController', ['$scope', function($scope) {
        $scope.signupData = {firstName:"", lastName:"", dateOfBirth:0, gender:"", tel:{areaCode:"", number:""}, emailId:"", password:"" };
        $scope.genders = [{value:"male", label:"Male"}, {value:"female",label:"Female"}, {value:"other",label:"Other"}];
        $scope.invalidGenderSelection = false;

    }])

    .controller('SignupController', ['$scope', function($scope) {
       $scope.sendSignup = function() {
            console.log($scope.signupData);
            if ($scope.signupData.gender == "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidGenderSelection = false;
                // TODO: Send to server for signup
                // TODO: Switch to user home
                $scope.signupData = {firstName:"", lastName:"", dateOfBirth:0, gender:"male", tel:{areaCode:"", number:""}, emailId:"", password:"" };
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

