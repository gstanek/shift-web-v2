
angular.module('myApp.userService', ['LocalStorageModule'])


.service('userService', ['$rootScope', 'localStorageService', '$http', 'commonService',
    function($rootScope, localStorageService, $http, commonService) {

    this.updateUser = function(user) {
        //TODO align on realm objects vs realm ID stored as part of users.  Probably should be realm_id
        if(user.realms && user.realms[0] && user.realms[0].id) {
            var realms = [];
            for(var i = 0; i<user.realms.length; i++) {

                realms.push(user.realms[i].id);
            }
            user.realms = realms;
        }

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

    this.verify_invitee = function(email, invite_code) {

        var verifyUrl = 'http://127.0.0.1:8000/api/v1/user/invite/email/' + email + '/code/' + invite_code;
        $http({
            method: 'GET',
            url: verifyUrl,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function successCallback(response) {
                console.log("Verify Invite Success: " + JSON.stringify(response));
                var responseObject = commonService.generateResponseObject(response);
                $rootScope.$broadcast('INVITE_EVENT', responseObject);
            }, function errorCallback(response) {
                console.log("Verify Invite Error: " + JSON.stringify(response));
                var errorResponseObject = commonService.generateErrorResponseObject(response);
                $rootScope.$broadcast('INVITE_EVENT', errorResponseObject);
            });
    };

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

    this.addLocalCoworkers = function(coworkers, updatePersonaDisplayState) {
        var existingCoworkers = localStorageService.get('coworkers');
        if(existingCoworkers != null) {
            var arrayLength = coworkers.length;
            for (var i = 0; i < arrayLength; i++) {
                existingCoworkers.push(coworkers[i]);
            }
            localStorageService.set('coworkers', existingCoworkers);
        }
        else {
            localStorageService.set('coworkers', coworkers);
        }
        $rootScope.$broadcast('COWORKER_CHANGE_EVENT', coworkers);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };

    this.setLocalCoworkers = function(coworkers, updatePersonaDisplayState) {
        localStorageService.set('coworkers', coworkers);
        $rootScope.$broadcast('COWORKER_CHANGE_EVENT', coworkers);
        if(updatePersonaDisplayState) {
            console.log('Update Persona Display State persona state update');
            commonService.setPersonaDisplayState();
        }
    };
    this.getLocalCoworkers = function() {
        return localStorageService.get('coworkers');
    };
    this.removeLocalCoworkers = function(updatePersonaDisplayState) {
        localStorageService.remove('coworkers');
        // $rootScope.$broadcast('USER_CHANGE_EVENT', null);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
    this.setLocalUser = function(user, updatePersonaDisplayState) {
        localStorageService.set('user', user)
        var broadcastObj = {
            type: 'UPDATE',
            value: user
        };
        $rootScope.$broadcast('USER_CHANGE_EVENT', broadcastObj);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }

    };
    this.getLocalUser = function() {
        return localStorageService.get('user');
    };
    this.removeLocalUser = function(updatePersonaDisplayState) {
        localStorageService.remove('user');
        var broadcastObj = {
            type: 'DELETE',
            value: null
        }
        $rootScope.$broadcast('USER_CHANGE_EVENT', broadcastObj);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
}]);