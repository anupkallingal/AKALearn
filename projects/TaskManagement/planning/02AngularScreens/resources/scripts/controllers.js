/*jslint node: true */
"use strict";

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

    .controller('SignupController', ['$scope', 'AuthenticationFactory', '$state', 'ngDialog', 'dateFormat', 'dateService', function ($scope, AuthenticationFactory, $state, ngDialog, dateFormat, dateService) {
        $scope.signupData = {firstName: "", lastName: "", dateOfBirth: 0, gender: "", tel: {areaCode: "", number: ""}, emailId: "", password: "", dateOfBirthDisplay: "" };
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];

        $scope.invalidGenderSelection = false;
        $scope.invalidRegisteredEmailEntry = false;
        $scope.displayWarningMessage = false;
        $scope.warningMessage = "";
        $scope.displayErrorMessage = false;
        $scope.errorMessage = "";
        $scope.dateFormat = dateFormat;

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
                        var errorMessage;
                        // No user with submitted email id exists
                        if (user === null) {
                            // Handle date conversion
                            $scope.signupData.dateOfBirth = undefined;
                            try {
                                $scope.signupData.dateOfBirth = dateService.toDateValue($scope.signupData.dateOfBirthDisplay);
                            } catch (e) {
                                console.log(e.message);
                            }
                            console.log('The dateOfBirth after conversion: ' + $scope.signupData.dateOfBirth);
                            if ($scope.signupData.dateOfBirth) {
                                delete $scope.signupData.dateOfBirthDisplay;
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
                                errorMessage = "The date of birth " + $scope.signupData.dateOfBirthDisplay + " is invalid";
                                console.log(errorMessage);
                                $scope.displayErrorMessage = true;
                                $scope.errorMessage = errorMessage;
                                $scope.invalidDateOfBirth = true;
                            }
                        } else {
                            // username/email id is aready registered
                            errorMessage = "The emailId " + $scope.signupData.emailId + " is already registered";
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

    .controller('HeaderController', ['$scope', '$rootScope', 'AuthenticationFactory', '$state', 'ngDialog', 'userNotificationsService', function ($scope, $rootScope, AuthenticationFactory, $state, ngDialog, userNotificationsService) {
        $scope.loggedIn = false;
        $scope.userName = '';
        $scope.displayName = '';
        $scope.newNotifications = '';

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.loggedIn = AuthenticationFactory.isAuthenticated();
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.displayName = AuthenticationFactory.getDisplayName();

            userNotificationsService.getNewNotifications($scope.userName,
                function (notifications) {
                    console.log("Received following new notifications: " + JSON.stringify(notifications));
                    $scope.newNotifications = notifications.length;
                }, function (error) {
                    console.log("Error while fecthing new notifications " + JSON.stringify(error));
                    $scope.newNotifications = '';
                });
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

    .controller('UserController', ['$scope', '$state', function ($scope, $state) {
        $state.go('user.lists', {}, {reload: true});
    }])

    .controller('ListsController', ['$scope', '$rootScope', 'AuthenticationFactory', '$state', 'userInfoService', function ($scope, $rootScope, AuthenticationFactory, $state, userInfoService) {
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
                $scope.userLists = response;
                $scope.showLists = true;
            },
            function (response) {
                $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
            });
    }])

    .controller('AddListController', ['$scope', '$state', '$rootScope', 'AuthenticationFactory', 'userInfoService', function ($scope, $state, $rootScope, AuthenticationFactory, userInfoService) {
        $scope.userName = "";
        $scope.list = {
            "name": "",
            "subItemsCount": 0,
            "owner": ""
        };
        $scope.showList = false;
        $scope.message = "Loading ...";

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.showList = true;
        }

        $rootScope.$on('login:Successful', function () {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.showList = true;
        });

        $scope.createList = function () {
            console.log("Received list: " + JSON.stringify($scope.list) + " for creation ");
            $scope.list.owner = $scope.userName;
            // Proceed to creation
            userInfoService.createList($scope.list,
                function (response) {
                    console.log("Ready with created list: " + JSON.stringify(response));
                    // Switch to view lists mode
                    $state.go('user.lists', {}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error while creating list data: " + response.status + " " + response.statusText;
                });
        };

    }])

    .controller('ListController', ['$scope', '$rootScope', 'AuthenticationFactory', '$state', '$stateParams', 'userInfoService', function ($scope, $rootScope, AuthenticationFactory, $state, $stateParams, userInfoService) {
        $scope.userName = '';
        $scope.shortName = '';
        $scope.listId = $stateParams.id;
        $scope.listName = '';
        $scope.showList = false;
        $scope.taskList = [];
        $scope.message = "Loading ...";

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.shortName = AuthenticationFactory.getShortName();
        }

        $rootScope.$on('login:Successful', function () {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.shortName = AuthenticationFactory.getShortName();
        });

        userInfoService.getList($stateParams.id,
            function (response) {
                console.log("Ready with data to display" + JSON.stringify(response));
                $scope.listName = response.name;
            },
            function (response) {
                $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
            });

        userInfoService.getTasksForParent($stateParams.id,
            function (response) {
                console.log("Ready with data to display" + JSON.stringify(response));
                $scope.taskList = response;
                $scope.showList = true;
            },
            function (response) {
                $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
            });
    }])

    .controller('TaskController', ['$scope', '$state', 'AuthenticationFactory', '$stateParams', 'userInfoService', 'dateFormat', 'dateService', function ($scope, $state, AuthenticationFactory, $stateParams, userInfoService, dateFormat, dateService) {
        $scope.userLists = [];
        $scope.listName = '';

        $scope.task = {};
        $scope.showTask = false;
        $scope.message = "Loading ...";
        $scope.dateFormat = dateFormat;

        if (AuthenticationFactory.isAuthenticated()) {
            userInfoService.getLists($scope.userName,
                function (response) {
                    console.log("Ready with lists to display" + JSON.stringify(response));
                    $scope.userLists = response;

                    userInfoService.getTask($stateParams.id,
                        function (response) {
                            console.log("Ready with task data to display" + JSON.stringify(response));
                            // TODO: The date coversion code should be moved to service layer
                            response.scheduledForDisplay = dateService.toDateString(response.scheduledFor);
                            response.dueDateDisplay = dateService.toDateString(response.dueDate);
                            $scope.task = response;
                            // Parent List Info (TODO: Try to remove the code below)
                            userInfoService.getList($scope.task.parentListId,
                                function (listResponse) {
                                    console.log("Ready with data of parent" + JSON.stringify(listResponse));
                                    $scope.listName = listResponse.name;
                                },
                                function (listResponse) {
                                    $scope.message = "Error while fetching parent list: " + response.status + " " + response.statusText;
                                });
                            $scope.showTask = true;
                        },
                        function (response) {
                            $scope.message = "Error while fetching user task: " + response.status + " " + response.statusText;
                        });
                },
                function (response) {
                    $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
                });
        }

        $scope.updateTask = function () {
            console.log("Received task: " + JSON.stringify($scope.task) + " for updation ");

            $scope.displayErrorMessage = $scope.displayWarningMessage = false;
            // Handle date conversion
            $scope.task.scheduledFor = undefined;
            $scope.task.dueDate = undefined;
            try {
                $scope.task.scheduledFor = dateService.toDateValue($scope.task.scheduledForDisplay);
                $scope.task.dueDate = dateService.toDateValue($scope.task.dueDateDisplay);
            } catch (e) {
                console.log(e.message);
            }
            console.log('The scheduledFor after conversion: ' + $scope.task.scheduledFor);
            console.log('The dueDate after conversion: ' + $scope.task.dueDate);
            if ($scope.task.scheduledFor && $scope.task.dueDate) {
                // Proceed to update
                userInfoService.updateTask($stateParams.id, $scope.task,
                    function (response) {
                        console.log("Ready with updated task data" + JSON.stringify(response));
                        // Switch to view mode
                        $state.go('user.task', {id: $stateParams.id}, {reload: true});
                    },
                    function (response) {
                        $scope.message = "Error while updating task data: " + response.status + " " + response.statusText;
                    });
            } else {
                var errorMessage = "";
                if (!$scope.task.scheduledFor) {
                    errorMessage = "The scheduled for date " + $scope.task.scheduledForDisplay + " is invalid";
                    $scope.invalidScheduledForDateOfBirth = true;
                } else {
                    errorMessage = "The due date " + $scope.task.dueDateDisplay + " is invalid";
                    $scope.invalidDueDateOfBirth = true;
                }
                console.log(errorMessage);
                $scope.displayErrorMessage = true;
                $scope.errorMessage = errorMessage;
            }
        };

        $scope.deleteTask = function () {
            console.log("Received task: " + JSON.stringify($scope.task) + " for deletion ");
            userInfoService.deleteTask($stateParams.id,
                function (response) {
                    console.log("Completed deletion of task " + JSON.stringify(response));
                    // Switch to view mode
                    $state.go('user.list', {id: $scope.task.parentListId}, {reload: true});
                },
                function (response) {
                    $scope.message = "Error while deleting task data: " + response.status + " " + response.statusText;
                });
        };
    }])

    .controller('AddTaskController', ['$scope', '$state', '$stateParams', '$rootScope', 'AuthenticationFactory', 'userInfoService', 'dateFormat', 'dateService', function ($scope, $state, $stateParams, $rootScope, AuthenticationFactory, userInfoService, dateFormat, dateService) {
        $scope.userLists = [];
        $scope.listName = '';

        $scope.task = {"priority": "normal"};
        $scope.showTask = false;
        $scope.message = "Loading ...";
        $scope.dateFormat = dateFormat;
        if ($stateParams.parentListId !== null && $stateParams.parentListId !== undefined) {
            $scope.task.parentListId = parseInt($stateParams.parentListId, 10);
        }
        console.log("Default Task: " + JSON.stringify($scope.task));
        if (AuthenticationFactory.isAuthenticated()) {
            userInfoService.getLists($scope.userName,
                function (response) {
                    console.log("Ready with lists to display" + JSON.stringify(response));
                    $scope.userLists = response;
                    $scope.showTask = true;
                },
                function (response) {
                    $scope.message = "Error while fetching user task: " + response.status + " " + response.statusText;
                });
        }

        $scope.createTask = function () {
            console.log("Received task: " + JSON.stringify($scope.task) + " for creation ");

            $scope.displayErrorMessage = $scope.displayWarningMessage = $scope.invalidParenetListSelection = false;
            // Validate parent list
            console.log("$scope.task.parentListId: " + $scope.task.parentListId);
            if ($scope.task.parentListId === null || $scope.task.parentListId === undefined || $scope.task.parentListId === "") {
                $scope.invalidParenetListSelection = true;
                console.log('Incorrect parent list');
            } else {
                // Handle date conversion
                $scope.task.scheduledFor = undefined;
                $scope.task.dueDate = undefined;
                try {
                    $scope.task.scheduledFor = dateService.toDateValue($scope.task.scheduledForDisplay);
                    $scope.task.dueDate = dateService.toDateValue($scope.task.dueDateDisplay);
                } catch (e) {
                    console.log(e.message);
                }
                console.log('The scheduledFor after conversion: ' + $scope.task.scheduledFor);
                console.log('The dueDate after conversion: ' + $scope.task.dueDate);
                if ($scope.task.scheduledFor && $scope.task.dueDate) {
                    // Set the owner
                    $scope.task.owner = $scope.userName;
                    // Proceed to creation
                    userInfoService.createTask($scope.task,
                        function (response) {
                            console.log("Ready with created task: " + JSON.stringify(response));
                            // Switch to view lists mode
                            $state.go('user.lists', {}, {reload: true});
                        },
                        function (response) {
                            $scope.message = "Error while creating task data: " + response.status + " " + response.statusText;
                        });
                } else {
                    var errorMessage = "";
                    if (!$scope.task.scheduledFor) {
                        errorMessage = "The scheduled for date " + $scope.task.scheduledForDisplay + " is invalid";
                        $scope.invalidScheduledForDateOfBirth = true;
                    } else {
                        errorMessage = "The due date " + $scope.task.dueDateDisplay + " is invalid";
                        $scope.invalidDueDateOfBirth = true;
                    }
                    console.log(errorMessage);
                    $scope.displayErrorMessage = true;
                    $scope.errorMessage = errorMessage;
                }
            }
        };
    }])

    .controller('NotificationsController', ['$scope', '$rootScope', 'AuthenticationFactory', 'userNotificationsService', 'dateService', 'iconService', function ($scope, $rootScope, AuthenticationFactory, userNotificationsService, dateService, iconService) {
        $scope.userName = '';
        $scope.userNotifications = [];
        $scope.showNotifications = false;
        $scope.message = "Loading ...";

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.userName = AuthenticationFactory.getUsername();
        }

        $rootScope.$on('login:Successful', function () {
            $scope.userName = AuthenticationFactory.getUsername();
        });

        userNotificationsService.getActiveNotifications($scope.userName,
            function (response) {
                angular.forEach(response, function (value, key) {
                    value.notificationDateDisplay = dateService.toSortedDateTimeString(value.notificationDate);
                    value.typeIcon = iconService.getNotificationIcon(value.type);
                });
                console.log("Ready with data to display" + JSON.stringify(response));
                $scope.userNotifications = response;
                $scope.showNotifications = true;
            },
            function (response) {
                $scope.message = "Error while fetching user lists: " + response.status + " " + response.statusText;
            });
    }])

    .controller('ProfileController', ['$scope', '$state', 'AuthenticationFactory', 'dateFormat', 'dateService', function ($scope, $state, AuthenticationFactory, dateFormat, dateService) {
        $scope.genders = [{value: "male", label: "Male"}, {value: "female", label: "Female"}, {value: "other", label: "Other"}];
        $scope.userName = '';
        $scope.displayName = '';

        $scope.userProfile = {};
        $scope.passwordData = {};
        $scope.showProfile = false;
        $scope.message = "Loading ...";
        $scope.dateFormat = dateFormat;

        if (AuthenticationFactory.isAuthenticated()) {
            $scope.userName = AuthenticationFactory.getUsername();
            $scope.displayName = AuthenticationFactory.getDisplayName();
            console.log('Search for $scope.userName: ' + $scope.userName);

            AuthenticationFactory.findUserWithId($scope.userName,
                function (user) {
                    var errorMessage;
                    // No user with submitted email id exists
                    if (user === null) {
                        console.log('Unable to find user with id: ' + $scope.userName);
                        $scope.displayErrorMessage = true;
                        $scope.errorMessage = errorMessage;
                    } else {
                        user.dateOfBirthDisplay = dateService.toDateString(user.dateOfBirth);
                        console.log("Ready with user data to display" + JSON.stringify(user));

                        $scope.userProfile = user;
                        $scope.showProfile = true;
                    }
                }, function (errorMessage) {
                    console.log('Unable to find user due to: ' + errorMessage);
                    $scope.displayErrorMessage = true;
                    $scope.errorMessage = errorMessage;
                    // TODO: event.preventDefault();
                });
        }

        $scope.updateProfile = function () {
            console.log("Received profile: " + JSON.stringify($scope.userProfile) + " for updation ");

            $scope.displayErrorMessage = $scope.displayWarningMessage = $scope.invalidGenderSelection = false;
            if ($scope.userProfile.gender === null || $scope.userProfile.gender === "") {
                $scope.invalidGenderSelection = true;
                console.log('incorrect');
                // TODO: event.preventDefault();
            } else {

                // Handle date conversion
                $scope.userProfile.dateOfBirth = undefined;
                try {
                    $scope.userProfile.dateOfBirth = dateService.toDateValue($scope.userProfile.dateOfBirthDisplay);
                } catch (e) {
                    console.log(e.message);
                }
                console.log('The dateOfBirth after conversion: ' + $scope.userProfile.dateOfBirth);

                if ($scope.userProfile.dateOfBirth) {
                    AuthenticationFactory.updateProfile($scope.userProfile,
                        function (response) {
                            console.log('User updated: ' + JSON.stringify(response));
                            // Switch to view mode
                            $state.go('user.profile', {}, {reload: true});
                        },
                        function (response) {
                            var errorMessage = "Error while updating user profile: " + response;
                            console.log(errorMessage);
                            $scope.displayErrorMessage = true;
                            $scope.errorMessage = errorMessage;
                        });
                } else {
                    var errorMessage = "The date of birth " + $scope.userProfile.dateOfBirthDisplay + " is invalid";
                    console.log(errorMessage);
                    $scope.displayErrorMessage = true;
                    $scope.errorMessage = errorMessage;
                    $scope.invalidDateOfBirth = true;
                }

            }
        };

        $scope.updatePassword = function () {
            console.log("Received password data: " + JSON.stringify($scope.passwordData) + " for updation ");

            $scope.displayErrorMessage = $scope.displayWarningMessage = $scope.invalidConfirmPassword = false;
            if ($scope.passwordData.newPassword === $scope.passwordData.confirmNewPassword) {
                AuthenticationFactory.updatePassword($scope.userProfile.id, $scope.passwordData.currentPassword, $scope.passwordData.newPassword,
                    function (response) {
                        console.log('User password updated: ' + JSON.stringify(response));
                        // Switch to view mode
                        $state.go('user.profile', {}, {reload: true});
                    },
                    function (response) {
                        var errorMessage = "Error while updating user password: " + response;
                        console.log(errorMessage);
                        $scope.displayErrorMessage = true;
                        $scope.errorMessage = errorMessage;
                    });
            } else {
                var errorMessage = "The new password and its confirmation are not the same ";
                console.log(errorMessage);
                $scope.displayErrorMessage = true;
                $scope.errorMessage = errorMessage;
                $scope.invalidConfirmPassword = true;
            }
        };
    }]);
