
angular.module('myApp.userService', ['LocalStorageModule'])


.service('userService', ['$rootScope', 'localStorageService', '$http', 'commonService',
    function($rootScope, localStorageService, $http, commonService) {

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

    this.createUsers = function(createUsersPayload) {
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/user/bulk',
            headers: {
                'Content-Type': 'application/json'
            },
            data: createUsersPayload
        });
    }

    this.getBestDisplayName = function() {
        var user = this.getLocalUser();
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

    this.setLocalCoworkers = function(coworkers, updatePersonaDisplayState) {
        localStorageService.set('coworkers', coworkers);
        $rootScope.$broadcast('USER_CHANGE_EVENT', coworkers);
        if(updatePersonaDisplayState) {
            console.log('Update Persona Display State persona state update');
            commonService.setPersonaDisplayState();
        }
    };
    this.getLocalCoworkers = function() {
        return localStorageService.get('coworkers');
    };
    this.removeLocalCoworkers = function() {
        localStorageService.remove('coworkers');
        $rootScope.$broadcast('USER_CHANGE_EVENT', null);
        commonService.setPersonaDisplayState();
    };
    this.setLocalUser = function(user, updatePersonaDisplayState) {
        localStorageService.set('user', user)

        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }

    };
    this.getLocalUser = function() {
        return localStorageService.get('user');
    };
    this.removeLocalUser = function(updatePersonaDisplayState) {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', null);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
}]);