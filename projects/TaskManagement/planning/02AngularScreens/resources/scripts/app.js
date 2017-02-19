'use strict';

angular.module('karyaApp', ['ui.router', 'ngResource', 'ngDialog'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the user page
            .state('user', {
                url: '/user',
                views: {
                    'header': {
                        templateUrl : 'resources/views/companyHeader.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        template: '<h1 class="dummySection">User page To be Completed</h1>',
                        controller  : 'UserController'
                    },
                    'footer': {
                        templateUrl : 'resources/views/companyFooter.html',
                        controller  : 'FooterController'
                    }
                }
            })

            // route for the home page
            .state('app', {
                url: '/:scrollTo',
                views: {
                    'header': {
                        templateUrl : 'resources/views/appHeader.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'resources/views/appProduct.html',
                        controller  : 'ProductController'
                    },
                    'footer': {
                        templateUrl : 'resources/views/companyFooter.html',
                        controller  : 'FooterController'
                    }
                },
                onEnter: function ($location, $stateParams, $anchorScroll, $timeout) {
                    $timeout(function () {
                        $location.hash($stateParams.scrollTo);
                        $anchorScroll();
                    }, 100);
                }
            })

            // route for the home page
            .state('company', {
                url: '/company',
                views: {
                    'header': {
                        templateUrl : 'resources/views/companyHeader.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        template: '<h1 class="dummySection">To be Completed</h1>',
                        controller  : 'CompanyController'
                    },
                    'footer': {
                        templateUrl : 'resources/views/companyFooter.html',
                        controller  : 'FooterController'
                    }
                }
            })

            // route for the aboutus page
            .state('company.aboutus', {
                url: '/aboutus',
                views: {
                    'content@': {
                        template: '<h1 class="dummySection">About Us: To be Completed</h1>',
                        controller  : 'AboutUsController'
                    }
                }
            })

            // route for the blogs page
            .state('company.blogs', {
                url: '/blogs',
                views: {
                    'content@': {
                        template: '<h1 class="dummySection">Blogs: To be Completed</h1>',
                        controller  : 'BlogsController'
                    }
                }
            })

            // route for the contactus page
            .state('company.contactus', {
                url: '/contactus',
                views: {
                    'content@': {
                        template: '<h1 class="dummySection">Cotact Us: To be Completed</h1>',
                        controller  : 'ContactUsController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');
    });

