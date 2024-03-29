
angular.module('ShiftOnTapApp')

.service('userService', ['$rootScope', 'localStorageService', '$http', 'commonService', '$q', '$log',
function($rootScope, localStorageService, $http, commonService, $q, $log) {

    var self = this;

    /**
     * Update User will update the user object on the server side as well as in local storage
     * @param user User object for update
     * @returns { A promise that
     *  for success case resolves to updated user object, or
     *  for failure case rejects with a standard Error Response Object}
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
            return $q.reject(response);
        });
    };

    /**
     * Create new provisional users in backend, sending invites when appropriate.
     * Add new coworkers to local coworker set.
     * @param createUsersPayload
     * @returns { A promise that
     *  for success case returns users added
     *  for failure case rejects with standard Error Response Object}
     */
    this.createUsers = function(createUsersPayload) {

        var users = createUsersPayload.users;

        // Populate each user with a default timezone
        var timezoneGuess = moment.tz.guess();
        for (var i = 0; i < users.length; i++) {
            users[i].timezone = timezoneGuess;
        }

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
            return $q.reject(response);
        });
    };


    /**
     * Verify invite valid, and if valid, mark invite as activated so it can't be used again
     * @param email
     * @param inviteCode
     * @returns { A promise that
     *  for success case returns response data
     *  for failure case rejects with standard Error Response Object}
     */
    this.verifyInvitee = function(email, inviteCode) {
        var verifyUrl = 'http://127.0.0.1:8000/api/v1/user/invite/email/' + email + '/code/' + inviteCode;
        return $http({
            method: 'GET',
            url: verifyUrl
        }).then(function successCallback(response) {
            return response.data;
        }).catch(function errorCallback(response) {
            return $q.reject(response);
        });
    };

    /**
     * Identifies best display name for user based on local storage
     * @returns String representing best display name
     */
    this.getBestDisplayName = function() {
        var user = self.getLocalUser();
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

    /**
     * Adds array of passed in coworkersToAdd to local coworker storage
     * @param coworkersToAdd - coworkersToAdd array to add
     * @param updatePersonaDisplayState - boolean whether or not to broadcast a notification
     */
    this.addLocalCoworkers = function(coworkersToAdd, updatePersonaDisplayState) {
        var existingCoworkers = localStorageService.get('coworkers');

        coworkersToAdd.sort(
            function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            }
        );

        if(existingCoworkers != null) {
            // Insert new coworkersToAdd in order, only if they're new
            var existingCoworkersLength = existingCoworkers.length
            var newCoworkersLength = coworkersToAdd.length;
            var existingCoworkerIndex = existingCoworkersLength - 1;
            for (var newCoworkerIndex = 0; newCoworkerIndex<newCoworkersLength ; newCoworkerIndex++) {
                while(existingCoworkerIndex>=0 && existingCoworkers[existingCoworkerIndex].id > coworkersToAdd[newCoworkerIndex].id ) {
                    existingCoworkerIndex--;
                }
                if(existingCoworkers[existingCoworkerIndex].id == coworkersToAdd[newCoworkerIndex].id) {
                    // Update coworker with latest given the coworker already exists
                    existingCoworkers.splice(existingCoworkerIndex, 1, coworkersToAdd[newCoworkerIndex]);
                }
                else {
                    // Insert new coworker
                    existingCoworkers.splice(existingCoworkerIndex+1, 0, coworkersToAdd[newCoworkerIndex]);
                    existingCoworkerIndex++;
                }
            }
            localStorageService.set('coworkers', existingCoworkers);
            $rootScope.$broadcast('COWORKER_CHANGE_EVENT', existingCoworkers);
        }
        else {
            localStorageService.set('coworkers', coworkersToAdd);
            $rootScope.$broadcast('COWORKER_CHANGE_EVENT', coworkersToAdd);
        }

        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };



    /**
     * Sets passed in coworkers to local coworker variable overwriting any previous value
     * @param coworkers - coworkers array to set
     * @param updatePersonaDisplayState - boolean whether or not to broadcast a notification
     */
    this.setLocalCoworkers = function(coworkers, updatePersonaDisplayState) {
        coworkers.sort(
            function(a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            }
        );

        localStorageService.set('coworkers', coworkers);
        $rootScope.$broadcast('COWORKER_CHANGE_EVENT', coworkers);
        if(updatePersonaDisplayState) {
            $log.info('Update Persona Display State persona state update');
            commonService.setPersonaDisplayState();
        }
    };

    /**
     * Returns coworkers stored locally
     */
    this.getLocalCoworkers = function() {
        return localStorageService.get('coworkers');
    };

    /**
     * Returns timezone stored locally
     */
    this.getLocalTimezone = function() {
        return localStorageService.get('timezone');
    };

    /**
     * Removes coworkers from local storage
     * @param updatePersonaDisplayState - boolean whether or not to broadcast a notification
     */
    this.removeLocalCoworkers = function(updatePersonaDisplayState) {
        localStorageService.remove('coworkers');
        // $rootScope.$broadcast('USER_CHANGE_EVENT', null);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };

    /**
     * Sets user to local storage
     * @param user - user to set
     * @param updatePersonaDisplayState - boolean whether or not to broadcast a notification
     */
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

    /**
     * Returns user from local storage
     */
    this.getLocalUser = function() {
        return localStorageService.get('user');
    };

    /**
     * Removes user from local storage
     * @param updatePersonaDisplayState - boolean whether or not to broadcast a notification
     */
    this.removeLocalUser = function(updatePersonaDisplayState) {
        localStorageService.remove('user');
        var broadcastObj = {
            type: 'DELETE',
            value: undefined
        }
        $rootScope.$broadcast('USER_CHANGE_EVENT', broadcastObj);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
}]);