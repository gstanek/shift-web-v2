
angular.module('myApp.authService', ['LocalStorageModule', 'myApp.userService'])

.service('authService', ['$rootScope', 'localStorageService', 'userService', '$auth', '$http', '$state', 'realmService', 'commonService', 'shiftService', 'RealmWebSocket',
    function($rootScope, localStorageService, userService, $auth, $http, $state, realmService, commonService, shiftService, RealmWebSocket) {


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
        // console.log("Token Expiration Time=" + token_exipiration_time);
        // console.log("Current=" + current.getTime());
        // var compare = token_exipiration_time > current.getTime();
        // console.log("compare=" + compare);

        if(token && token_exipiration_time) {
            var parsedDate = Date.parse(token_exipiration_time);
            if(parsedDate > current.getTime()) {
                return true;
            }
            else {
                return false;
            }
        }


        else {
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
        userService.removeLocalUser(false);
        userService.removeLocalCoworkers(false);
        shiftService.removeLocalShift(false);
        shiftService.removeLocalShifts(false);
        commonService.removeLocalPersonaDisplayState();
        realmService.removeLocalRealm(false);
        localStorageService.remove('token_expiration_time');
    };

    this.signup = function(credentials) {
        $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/user/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: credentials
        })
            .then(function successCallback(response) {
                console.log('signup response:' + JSON.stringify(response))
                self.setToken(response.data.access_token);
                self.setTokenExpirationTime(response.data.token_expiration_time);
                userService.setLocalUser(response.data.user, false);
                realmService.removeLocalRealm(false);
                shiftService.removeLocalShifts(false);
                $state.go('persona');
                commonService.setPersonaDisplayState();
            }, function errorCallback(response) {
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
            console.log("Login Success: " + JSON.stringify(loginResponse));

            self.setToken(loginResponse.data.access_token);
            self.setTokenExpirationTime(loginResponse.data.token_expiration_time);
            var user = loginResponse.data.user;
            userService.setLocalUser(user, false);

            // TODO Enable default preference for active realm instead of taking first
            var realm = user.realms[0];
            realmService.setLocalRealm(realm, false);
            if(realm) {
                RealmWebSocket.connect();
                userService.setLocalCoworkers(realm.users, false);
                shiftService.getShifts(true);
                $state.go('persona');
            }

            commonService.setPersonaDisplayState();
        }, function errorCallback(loginResponse) {
            console.log("Login Error: " + JSON.stringify(loginResponse));
            var errorObject = {
                httpStatusCode : loginResponse,
                message : loginResponse.data
            }
            return errorObject;
        });
    };

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
            //TODO: Ensure disconnect happens on server side
            //RealmWebSocket.disconnect();
            $auth.removeToken();
            userService.removeLocalUser(false);
            userService.removeLocalCoworkers();
            shiftService.removeLocalShift();
            shiftService.removeLocalShifts();
            commonService.removeLocalPersonaDisplayState();
            realmService.removeLocalRealm();
            localStorageService.remove('token_expiration_time');

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
.factory('authHttpInterceptor', ['$q', '$rootScope',
    function($q, $rootScope) {
        return {

            'responseError': function(rejection) {
                if(rejection.status == 401) {
                    $rootScope.$broadcast('UNAUTHORIZED_EVENT', { rejection : rejection });
                    return $q.reject(rejection.data);
                }
                else if(rejection.status == 400) {
                    $rootScope.$broadcast('BAD_REQUEST_EVENT', { rejection : rejection });
                    return $q.reject(rejection.data);
                }
                else {
                    return $q.reject(rejection);
                }
            }
            // 'response': function(response) {
            //     // do something on success
            //     return response || $q.when(response);
            // }
        };
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authHttpInterceptor');
}]);