
angular.module('ShiftOnTapApp')

.service('authService', ['$rootScope', 'localStorageService', 'userService', '$auth', '$http', '$state', 'realmService', 'commonService', 'shiftService', 'personaService', 'RealmWebSocket',
    function($rootScope, localStorageService, userService, $auth, $http, $state, realmService, commonService, shiftService, personaService, RealmWebSocket) {

    var self = this;

    this.validateAuthenticated = function() {
        var isAuthenticated = this.isAuthenticated();
        if(isAuthenticated) {
            return true;
        }
        else {
            $state.go("home");
            return false;
        }
    }
    this.isAuthenticated = function() {
        var token = $auth.getToken();
        var token_exipiration_time = this.getTokenExpirationTime();

        var current = new Date();

        if(token && token_exipiration_time) {
            var parsedDate = Date.parse(token_exipiration_time);
            if(parsedDate > current.getTime()) {
                return true;
            }
            else {
                // self.clearUserContext();
                return false;
            }
        }
        else {
            // self.clearUserContext();
            return false;
        }
    };

    this.isAuthorized = function (requiredRole) {
        var activeUser = userService.getLocalUser();
        var roles = null;
        if(activeUser != null && activeUser.persona != null){
            roles = activeUser.persona.roles;
        }
        if (roles != null && roles.indexOf(requiredRole) > -1) {
            return true;
        } else {
            return false;
        }
    };

    this.clearUserContext = function() {
        //TODO: Ensure disconnect happens on server side
        //RealmWebSocket.disconnect();
        $auth.removeToken();


        // userService.removeLocalUser(false);
        // userService.removeLocalCoworkers(false);
        // shiftService.removeLocalShifts(false);
        // realmService.removeLocalRealm(false);
        // localStorageService.remove('token_expiration_time');
        // commonService.removeLocalPersonaDisplayState(false);

        localStorageService.clearAll();
        var broadcastObj = {
            type: 'DELETE',
            value: undefined
        }
        $rootScope.$broadcast('USER_CHANGE_EVENT', broadcastObj);

    };

    this.acceptInvite = function(credentials, invite_code) {
        var acceptInviteUrl = 'http://127.0.0.1:8000/api/v1/security/accept/';
        var invitePayload = {
            email : credentials.email,
            new_password: credentials.password,
            invite_code: invite_code
        }
        $http({
            method: 'PATCH',
            url: acceptInviteUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: invitePayload
        })
            .then(function successCallback(response) {
                console.log('Accept Invite Response:' + JSON.stringify(response));

                self._initUserState(response.data);

                // var responseObj = {
                //     status: 'success'
                // };
                // $rootScope.$broadcast('AUTH_SUCCESS_EVENT', responseObj);
                //
                // self.setToken(response.data.access_token);
                // self.setTokenExpirationTime(response.data.token_expiration_time);
                // var user = response.data.user;
                // userService.setLocalUser(user, false);
                //
                // // TODO Return realm id of invited and set that one to active
                // var realm = response.data.realm;
                // console.log('Realm=' + JSON.stringify(realm));
                // realmService.setLocalRealm(realm, false);
                // if(realm) {
                //     RealmWebSocket.connect();
                //     userService.setLocalCoworkers(realm.users, false);
                //     shiftService.getShifts(true);
                //     $state.go('persona');
                // }
            }, function errorCallback(response) {
                var responseObj = {
                    httpStatusCode : response.status,
                    code: response.code,
                    message : response.detail
                };
                $rootScope.$broadcast('AUTH_FAILURE_EVENT', responseObj);

                self.clearUserContext();
            });
    }

    this.signup = function(signUpRequest, channel) {
        var signupUrl = 'http://127.0.0.1:8000/api/v1/user/';

        signUpRequest.timezone = moment.tz.guess();

        $http({
            method: 'POST',
            url: signupUrl,
            headers: {
                'Content-Type': 'application/json'
            },
            data: signUpRequest
        })
            .then(function successCallback(response) {
                var responseObj = {
                    status: 'success'
                };
                // Reset Context
                self.clearUserContext();


                self._initUserState(response.data);


                // $rootScope.$broadcast('AUTH_SUCCESS_EVENT', responseObj);
                //
                // self.setToken(response.data.access_token);
                // self.setTokenExpirationTime(response.data.token_expiration_time);
                // userService.setLocalUser(response.data.user, false);
                // $state.go('persona');
                // commonService.setPersonaDisplayState();
            }, function errorCallback(response) {
                $rootScope.$broadcast('AUTH_FAILURE_EVENT', response);
                self.clearUserContext();
            });

    };

    this.login = function(credentials) {
        var user = {
            grant_type: 'password',
            client_id: 'AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE',
            username: credentials.email,
            password: credentials.password
        };
        var loginUrl = 'http://127.0.0.1:8000/api/v1/security/login?email=' + credentials.email + '&password=' + credentials.password;
        return $http({
            method: 'GET',
            url: loginUrl,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function successCallback(loginResponse) {
            //TODO Make this a broadcast of the AUTH_SUCCESS_EVENT
            // var responseObj = {
            //     status: 'success'
            // };
            // $rootScope.$broadcast('AUTH_SUCCESS_EVENT', responseObj);

            // var responseData = loginResponse.data;

            self._initUserState(loginResponse.data);

            // self._initUserState(
            //     responseData.access_token,
            //     responseData.token_expiration_time,
            //     responseData.user,
            //     responseData.realm,
            //     responseData.persona,
            //     responseData.shifts);

            // self.setToken(responseData.access_token);
            // self.setTokenExpirationTime(responseData.token_expiration_time);
            // userService.setLocalUser(responseData.user, false);
            // userService.setLocalCoworkers(responseData.realm.users, false);
            // realmService.setLocalRealm(responseData.realm, false);
            // RealmWebSocket.connect();
            // shiftService.setLocalShifts(responseData.shifts, true);
            // personaService.setLocalPersona(responseData.persona, false);

            // commonService.setPersonaDisplayState();
            // $state.go('persona');


        }, function errorCallback(response) {
            $rootScope.$broadcast('AUTH_FAILURE_EVENT', response);
            return response;
        });
    };

    this._initUserState = function(responseData) {
        var responseObj = {
            status: 'success'
        };
        $rootScope.$broadcast('AUTH_SUCCESS_EVENT', responseObj);

        self.setToken(responseData.access_token);
        self.setTokenExpirationTime(responseData.token_expiration_time);
        userService.setLocalUser(responseData.user, false);
        console.log('User=' + JSON.stringify(localStorageService.get('user')));
        if(responseData.realm) {
            userService.setLocalCoworkers(responseData.realm.users, false);
            realmService.setLocalRealm(responseData.realm, false);
            RealmWebSocket.connect();
            shiftService.setLocalShifts(responseData.shifts, true);
            personaService.setLocalPersona(responseData.persona, false);
        }

        commonService.setPersonaDisplayState();
        $state.go('persona');

    }

    this.setToken = function(token) {
        $auth.setToken(token);
    };

    this.logout = function() {
        var token = $auth.getToken();

        var revokeData = {
            grant_type: 'password',
            client_id: 'AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE',
            token: token
        };

        $http({
            method: 'POST',
            url: 'http://localhost:8000/o/revoke_token/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: revokeData
        }).then(function successCallback(response) {
            console.log('Success:' + JSON.stringify(response));
            // TODO: Ensure disconnect happens on server side
            //RealmWebSocket.disconnect();
            self.clearUserContext();
        }, function errorCallback(response) {
            console.log('Failure:' + JSON.stringify(response));
        });
    }


    this.getBestDisplayName = function() {
        if(user.preferredName != null) {
            return user.preferredName;
        }
        else if(user.firstName != null) {
            return user.firstName;
        }
        else if(user.email != null) {
            return user.email;
        }
        else {
            return 'Guest';
        }
    };

    this.setTokenExpirationTime = function(token_expiration_time) {
        localStorageService.set('token_expiration_time', token_expiration_time);
    };
    this.getTokenExpirationTime = function() {
        return localStorageService.get('token_expiration_time');
    };
    this.removeTokenExpirationTime = function() {
        localStorageService.remove('token_expiration_time');
    };


}])
.factory('httpInterceptor', ['$q', '$rootScope', 'commonService',
    function($q, $rootScope, commonService) {
        return {
            'request' : function (config) {
                config.headers['Accept'] = 'application/json';
                if(config.headers['Content-Type'] != 'application/x-www-form-urlencoded') {
                    config.headers['Content-Type'] = 'application/json';
                }

                return config;
            },

            'responseError': function(response) {
                var errorResponseObject = commonService.generateErrorResponseObject(response);
                if(response.status == 401) {
                    $rootScope.$broadcast('UNAUTHORIZED_EVENT', { rejection : response });
                    return $q.reject(errorResponseObject);
                }
                else {
                    return $q.reject(errorResponseObject);
                }
            }
            // 'response': function(response) {
            //     // do something on success
            //     return response || $q.when(response);
            // }
        };
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}])
;