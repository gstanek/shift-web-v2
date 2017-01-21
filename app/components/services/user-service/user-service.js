
angular.module('ShiftOnTapApp')

.service('userService', ['$rootScope', 'localStorageService', '$http', 'commonService',
function($rootScope, localStorageService, $http, commonService) {

    var self = this;

    /**
     * Update User will update the user object on the server side as well as in local storage
     * @param user User object for update
     * @returns { A promise that
     *  for success case resolves to updated user object, or
     *  for failure case resolves to standard Error Response Object}
     */
    this.updateUser = function(user) {
        return $http({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/user/' + user.id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: user
        }).then(function successCallback(response) {
            self.setLocalUser(response.data, true);
            return response.data;
        }).catch(function errorCallback(response) {
            var errorResponseObject = commonService.generateErrorResponseObject(response);
            throw errorResponseObject;
        });
    };

    /**
     * Create new provisional users in backend, sending invites when appropriate.
     * Add new coworkers to local coworker set.
     * @param createUsersPayload
     * @returns { A promise that
     *  for success case returns users added
     *  for failure case returns standard Error Response Object}
     */
    this.createUsers = function(createUsersPayload) {
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/user/bulk',
            headers: {
                'Content-Type': 'application/json'
            },
            data: createUsersPayload
        }).then(function successCallback(response) {
            self.addLocalCoworkers(response.data, true);
            return response.data;
        }).catch(function errorCallback(response) {
            var errorResponseObject = commonService.generateErrorResponseObject(response);
            throw errorResponseObject;
        });;
    };

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
            $rootScope.$broadcast('COWORKER_CHANGE_EVENT', existingCoworkers);
        }
        else {
            localStorageService.set('coworkers', coworkers);
            $rootScope.$broadcast('COWORKER_CHANGE_EVENT', coworkers);
        }

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