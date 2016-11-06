angular.module('myApp.commonService', [])//['myApp.userService','myApp.realmService','myApp.shiftService']) //[])
.service('commonService', ['localStorageService', '$rootScope',
    function(localStorageService, $rootScope) {

        // <!-- NO_REALM -->
        // <!-- REALM_NO_USER -->
        // <!-- REALM_USER_NO_SHIFTS -->
        // <!-- REALM_USER_SHIFTS_NO_COWORKERS -->
        // <!-- REALM_USER_SHIFTS_COWORKERS -->

        this.setPersonaDisplayState = function() {
            var activeRealm = this.getLocalRealm();
            if(activeRealm) {
                var activeUser = this.getLocalUser();
                if(activeUser) {
                    var shifts = this.getLocalShifts();
                    if(shifts) {
                        var coworkers = this.getLocalCoworkers();
                        if(coworkers  && coworkers.length > 0) {
                            this.setLocalPersonaDisplayState('REALM_USER_SHIFTS_COWORKERS');
                        }
                        else {
                            this.setLocalPersonaDisplayState('REALM_USER_SHIFTS_NO_COWORKERS');
                        }
                    }
                    else {
                        this.setLocalPersonaDisplayState('REALM_USER_NO_SHIFTS');
                    }
                }
                else {
                    this.setLocalPersonaDisplayState('REALM_NO_USER');
                }
            }
            else {
                this.setLocalPersonaDisplayState('NO_REALM');
            }
        }

        this.getLocalPersonaDisplayState = function() {
            return localStorageService.get('persona_display_state');
        };
        this.setLocalPersonaDisplayState = function(personaDisplayState) {
            localStorageService.set('persona_display_state', personaDisplayState)
            $rootScope.$broadcast('PERSONA_DISPLAY_STATE_CHANGE_EVENT', personaDisplayState);
        };
        this.removeLocalPersonaDisplayState = function() {
            localStorageService.remove('persona_display_state');
            $rootScope.$broadcast('PERSONA_DISPLAY_STATE_CHANGE_EVENT');
        };


        // TODO: These are added to avoid circular dependencies.  Look into avoiding the need for duplication.
        this.getLocalRealm = function() {
            return localStorageService.get('realm');
        };
        this.getLocalShifts = function() {
            var shifts = localStorageService.get('shifts');
            if(shifts) {
                if(shifts.length == 0) {
                    return null;
                }
            }
            return shifts;
        };
        this.getLocalCoworkers = function() {
            return localStorageService.get('coworkers');
        };
        this.getLocalUser = function() {
            return localStorageService.get('user');
        };

        this.roundMinutes = function(date) {
            date.setHours(date.getHours() + Math.round(date.getMinutes()/60));
            date.setMinutes(0);

            return date;
        }

    }]);