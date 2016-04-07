
angular.module('myApp.authService', ['LocalStorageModule', 'myApp.userService'])


.service('authService', ['$rootScope', 'localStorageService', 'userService', '$auth', '$http', function($rootScope, localStorageService, userService, $auth, $http) {

    // Global User Object
    var shift1 = {
        shiftID: '1616',
        starttime: '01/29/16 01:30:00',
        endtime: '01/29/16 04:30:00',
        available: true,
        realmID: '8900',
        userID: '123456'
    };
    var shift2 = {
        shiftID: '1617',
        starttime: '01/30/16 01:30:00',
        endtime: '01/30/16 04:30:00',
        available: false,
        realmID: '8900',
        userID: '123456'
    };
    var user = {
        id: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        email: ''
    };

    var exampleuser = {
        userID: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        email: '',
        persona: {
            personaID: '56789',
            roles: ['user', 'admin'],
            realm: {
                realmID: '8900',
                realmName: 'Joe\'s Pizza'
            },
            shifts : [shift1, shift2]
        }
    };

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
        //TODO SERVICE_LAYER Do signup request here
        console.log('signup service credentials=' + JSON.stringify(credentials))


        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/user/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: credentials
        });


        //TODO If signup success
        /*if(true) {
            //TODO replace with userID from response
            user = {};
            user.id = '23134543';
            user.email = credentials.email;
            userService.setActiveUser(user);
            return user;
        }
        else {
            //TODO on failure, fire event
            return null;
        }*/
    };

    this.login = function(credentials) {
        //TODO SERVICE_LAYER Do login request here

        var user = {
            grant_type: 'password',
            client_id: 'AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE',
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
        //TODO SERVICE_LAYER make logout request here

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
            $auth.removeToken();
        }, function errorCallback(response) {
            console.log('Failure:' + JSON.stringify(response));
        });

        userService.removeActiveUser();
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

    this.getCompanyName = function() {
        if(user.persona != null && user.persona.realm != null) {
            if(user.persona.realm.realmName) {
                return user.persona.realm.realmName;
            }
            return 'Company';
        }
        return 'Company';
    };

    this.setIdentityMap = function(user) {
        localStorageService.set('user', user)
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
    this.getIdentityMap = function() {
        return localStorageService.get('user');
    };
    this.removeActiveUser = function() {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
}]);