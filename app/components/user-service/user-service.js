
angular.module('myApp.userService', ['LocalStorageModule'])


.service('userService', ['$rootScope', 'localStorageService', '$http', function($rootScope, localStorageService, $http) {

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
        userID: '123456',
        firstName: '',
        lastName: '',
        preferredName: '',
        email: '',
        persona: {
            personaID: '56789',
            roles: ['user', 'admin'],
            realm: {
                realmID: '8900',
                realmName: ''
            }
        }
    };

    this.updateUser = function(user) {
        return $http({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/user/' + user.email,
            headers: {
                'Content-Type': 'application/json'
            },
            data: user
        });

    }

    this.getBestDisplayName = function() {
        user = this.getActiveUser();
        if(!user) {
            return '';
        }
        else if(user.preferred_name) {
            return user.preferred_name;
        }
        else if(user.first_name) {
            return user.first_name;
        }
        else if(user.email) {
            return user.email;
        }
        else {
            return 'Guest';
        }
    };


    this.getUserByEmail = function(email) {
        return $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/user/' + email,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    this.setActiveUser = function(user) {
        localStorageService.set('user', user)

        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
    this.getActiveUser = function() {
        return localStorageService.get('user');
    };
    this.removeActiveUser = function() {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
}]);