
angular.module('myApp.authService', ['LocalStorageModule', 'myApp.userService'])

.service('authService', ['$rootScope', 'localStorageService', 'userService', '$auth', '$http',
    function($rootScope, localStorageService, userService, $auth, $http) {

    this.isAuthenticated = function() {
        var activeUser = userService.getActiveUser();
        if(activeUser == null) {
            return false;
        }
        return true;
    };

    this.isAuthorized = function (requiredRole) {
        var activeUser = userService.getActiveUser();
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

    this.signup = function(credentials) {
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/user/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: credentials
        });
    };

    this.login = function(credentials) {
        var user = {
            grant_type: 'password',
            client_id: 'GqtWKUGixAaG727XNqsNrVlgcpDQsZ4MgZLvYev1',
            username: credentials.email,
            password: credentials.password
        };
        return $http({
            method: 'POST',
            url: 'http://localhost:8000/o/token/',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: user
        })
    };

    this.setToken = function(token) {
        $auth.setToken(token);
    };

    this.logout = function() {
        var token = $auth.getToken();

        var revokeData = {
            grant_type: 'password',
            client_id: 'GqtWKUGixAaG727XNqsNrVlgcpDQsZ4MgZLvYev1',
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
            $auth.removeToken();
            userService.removeActiveUser();
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

    // this.getCompanyName = function() {
    //     if(user.persona != null && user.persona.realm != null) {
    //         if(user.persona.realm.realmName) {
    //             return user.persona.realm.realmName;
    //         }
    //         return 'Company';
    //     }
    //     return 'Company';
    // };

    // this.setIdentityMap = function(user) {
    //     localStorageService.set('user', user)
    //     $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    // };
    // this.getIdentityMap = function() {
    //     return localStorageService.get('user');
    // };
    this.removeActiveUser = function() {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };


}])
.factory('authHttpInterceptor', ['$q',
    function($q) {
    return {

        // optional method
        'responseError': function(rejection) {
            // do something on error
            if(rejection.status == 401) {
                //TODO display login popup
            }
            // if (canRecover(rejection)) {
            //     return responseOrNewPromise
            // }
            return $q.reject(rejection);
        }
    };
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('authHttpInterceptor');
}]);