/*jslint node: true */
"use strict";

angular.module('karyaApp')

    .constant("baseURL", "http://localhost:3000/")

    .constant("dateFormat", "dd/MM/yyyy")

    .constant("dateLocale", "en-GB")

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
        var authFac, TOKEN_KEY, isAuthenticated, username, shortName, displayName, authToken;
        authFac = {};
        TOKEN_KEY = 'Token';
        isAuthenticated = false;
        username = '';
        shortName = '';
        displayName = '';
        authToken = undefined;

        function useCredentials(credentials) {
            console.log("In useCredentials() of AuthenticationFactory: " + JSON.stringify(credentials));
            isAuthenticated = true;
            username = credentials.username;
            shortName = credentials.shortName;
            displayName = credentials.displayName;
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
                        // Login the new user
                        authFac.login({username: registerData.id, password: registerData.password}, successFunction, errorFunction);
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

        authFac.updateProfile = function (userProfile, successFunction, errorFunction) {
            var messageString;
            console.log("Trying to update: " + JSON.stringify(userProfile));
            authFac.findUserWithId(userProfile.id,
                function (existingUser) {
                    if (existingUser !== null) {
                        console.log("Found user to update: " + JSON.stringify(existingUser));
                        // Update existingUser with profile fields
                        existingUser.firstName = userProfile.firstName;
                        existingUser.lastName = userProfile.lastName;
                        existingUser.dateOfBirth = userProfile.dateOfBirth;
                        existingUser.gender = userProfile.gender;
                        existingUser.tel = userProfile.tel;
                        console.log("Updating user to: " + JSON.stringify(userProfile));
                        var UserResource = $resource(baseURL + 'users/:id', {'id': userProfile.id}, {
                            'update': { method: 'PUT' }
                        });
                        // Save data to server
                        UserResource.update(existingUser, successFunction, errorFunction);
                    } else {
                        messageString = "Unable to find record with specified id " + JSON.stringify(userProfile);
                        console.log(messageString);
                        errorFunction(messageString);
                    }
                }, function (error) {
                    errorFunction(error);
                });
        };

        authFac.updatePassword = function (userId, currentPassword, newPassword, successFunction, errorFunction) {
            var messageString;
            console.log("Trying to update password: " + userId);
            authFac.findUserWithId(userId,
                function (existingUser) {
                    if (existingUser !== null) {
                        console.log("Found user to update: " + JSON.stringify(existingUser));
                        if (existingUser.password === currentPassword) {
                            // Update existingUser password
                            existingUser.password = newPassword;
                            console.log("Updating user to: " + JSON.stringify(existingUser));
                            var UserResource = $resource(baseURL + 'users/:id', {'id': userId}, {
                                'update': { method: 'PUT' }
                            });
                            // Save data to server
                            UserResource.update(existingUser, successFunction, errorFunction);
                        } else {
                            messageString = "The specified current password doesnot match ";
                            console.log(messageString);
                            errorFunction(messageString);
                        }
                    } else {
                        messageString = "Unable to find record with specified id " + userId;
                        console.log(messageString);
                        errorFunction(messageString);
                    }
                }, function (error) {
                    errorFunction(error);
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
                        storeUserCredentials({'username': existingUser[0].id, 'shortName': existingUser[0].firstName, 'displayName': existingUser[0].firstName + ' ' + existingUser[0].lastName, 'token': existingUser[0].lastName}); // TODO: LastName -> Token
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

        authFac.getShortName = function () {
            return shortName;
        };

        authFac.getDisplayName = function () {
            return displayName;
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

    .service('userInfoService', ['$resource', 'baseURL', function ($resource, baseURL) {

        this.getLists = function (userName, successFunction, errorFunction) {
            var User = $resource(baseURL + 'lists', {'owner': userName});
            User.query({'owner': userName}, successFunction, errorFunction);
        };

        this.createList = function (newList, successFunction, errorFunction) {
            // Save data to server
            var listsResource = $resource(baseURL + "lists");
            listsResource.save(newList, successFunction, errorFunction);
        };

        this.getList = function (listId, successFunction, errorFunction) {
            var User = $resource(baseURL + 'lists/:id', {'id': listId});
            User.get({'id': listId}, successFunction, errorFunction);
        };

        this.getTasksForParent = function (listId, successFunction, errorFunction) {
            var User = $resource(baseURL + 'tasks', {'parentListId': listId});
            User.query({'parentListId': listId}, successFunction, errorFunction);
        };

        this.getTask = function (taskId, successFunction, errorFunction) {
            var Task = $resource(baseURL + 'tasks/:id', {'id': taskId});
            Task.get({'id': taskId}, successFunction, errorFunction);
        };

        this.createTask = function (newTask, successFunction, errorFunction) {
            // Save data to server
            var tasksResource = $resource(baseURL + "tasks");
            tasksResource.save(newTask, successFunction, errorFunction);
        };

        this.updateTask = function (taskId, updatedTask, successFunction, errorFunction) {
            var Task = $resource(baseURL + 'tasks/:id', {'id': taskId}, {
                'update': { method: 'PUT' }
            });
            // Save data to server
            Task.update(updatedTask, successFunction, errorFunction);
        };

        this.deleteTask = function (taskId, successFunction, errorFunction) {
            var Task = $resource(baseURL + 'tasks/:id', {'id': taskId});
            Task.remove({'id': taskId}, successFunction, errorFunction);
        };
    }])

    .service('userNotificationsService', ['$resource', 'baseURL', function ($resource, baseURL) {
        this.getArchivedNotifications = function (userName, successFunction, errorFunction) {
            var NotificationsResource = $resource(baseURL + 'notifications', {'owner': userName, 'status': 'archived', '_sort': 'notificationDate', '_order': 'DESC'});
            NotificationsResource.query({'owner': userName}, successFunction, errorFunction);
        };

        this.getActiveNotifications = function (userName, successFunction, errorFunction) {
            var NotificationsResource = $resource(baseURL + 'notifications', {'owner': userName, 'status_ne': 'archived', '_sort': 'notificationDate', '_order': 'DESC'});
            NotificationsResource.query({'owner': userName}, successFunction, errorFunction);
        };

        this.getNewNotifications = function (userName, successFunction, errorFunction) {
            var NotificationsResource = $resource(baseURL + 'notifications', {'owner': userName, 'status': 'new', '_sort': 'notificationDate', '_order': 'DESC'});
            NotificationsResource.query({'owner': userName}, successFunction, errorFunction);
        };

        this.getNotification = function (notificationId, successFunction, errorFunction) {
            var NotificationsResource = $resource(baseURL + 'notifications/:id', {'id': notificationId});
            NotificationsResource.get({'id': notificationId}, successFunction, errorFunction);
        };

        this.updateNotification = function (notificationId, updatedState, successFunction, errorFunction) {
            var NotificationsResource = $resource(baseURL + 'notifications/:id', {'id': notificationId}, {
                'update': { method: 'PUT' }
            });
            NotificationsResource.get({'id': notificationId},
                function (existingNotification) {
                    console.log("Foun notification: " + JSON.stringify(existingNotification));
                    if (existingNotification !== null) {
                        existingNotification.state = updatedState;
                        // Save data to server
                        NotificationsResource.update(existingNotification, successFunction, errorFunction);
                    } else {
                        var messageString = "Unable to find record with specified id " + notificationId;
                        console.log(messageString);
                        errorFunction(messageString);
                    }
                },
                errorFunction);
        };
    }])

    .service('iconService', [function () {
        // Get the icon for notification based on its type
        this.getNotificationIcon = function (notificationType) {
            switch (notificationType) {
            case "Tasks For Day":
                return "fa-list";
            case "New Task Created":
                return "fa-plus-square";
            case "Task Updated":
                return "fa-pencil-square";
            case "Task Complete":
                return "fa-check-square";
            case "Task Overdue":
                return "fa-bell-o";
            case "Priority Task Overdue":
                return "fa-bell";
            default:
                return "fa-list";
            }
        };
    }])

    .service('dateService', ['dateFormat', 'dateLocale', function (dateFormat, dateLocale) {

        // parse a date in dd/mm/yyyy format
        this.toDateValue = function (dateString) {
            var parts, convertedDate, dateValue;
            parts = dateString.split('/');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            convertedDate = new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based;
            dateValue = convertedDate.getTime();
            return dateValue;
        };

        this.toDateString = function (dateValue) {
            var convertedDate, dateString;
            convertedDate = new Date(dateValue);
            dateString = convertedDate.toLocaleDateString(dateLocale);
            return dateString;
        };

        this.toDateTimeString = function (dateValue) {
            var convertedDate, dateString;
            convertedDate = new Date(dateValue);
            dateString = convertedDate.toLocaleString(dateLocale);
            return dateString;
        };

        this.toSortedDateTimeString = function (dateValue) {
            var convertedDate, dateString;
            convertedDate = new Date(dateValue);
            if (convertedDate.toDateString() === new Date().toDateString()) {
                dateString = convertedDate.toLocaleTimeString();
            } else {
                dateString = convertedDate.toLocaleDateString(dateLocale);
            }
            return dateString;
        };
    }]);
