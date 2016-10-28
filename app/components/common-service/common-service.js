angular.module('myApp.commonService', [])//['myApp.userService','myApp.realmService','myApp.shiftService']) //[])
.service('commonService', ['localStorageService', '$rootScope',
    function(localStorageService, $rootScope) {


        // <!-- NO_REALM -->
        // <!-- REALM_NO_USER -->
        // <!-- REALM_USER_NO_COWORKERS -->
        // <!-- REALM_USER_COWORKERS_NO_SHIFTS -->
        // <!-- REALM_USER_COWORKERS_SHIFTS -->

        this.setPersonaDisplayState = function() {
            var activeRealm = this.getLocalRealm();
            if(activeRealm) {
                var activeUser = this.getLocalUser();
                if(activeUser) {
                    var coworkers = this.getLocalCoworkers();
                    if(coworkers  && coworkers.length > 0) {
                        var shifts = this.getLocalShifts();
                        if(shifts) {
                            console.log('returning REALM_USER_COWORKERS_SHIFTS');
                            this.setLocalPersonaDisplayState('REALM_USER_COWORKERS_SHIFTS');
                        }
                        else {
                            console.log('returning REALM_USER_COWORKERS_NO_SHIFTS');
                            this.setLocalPersonaDisplayState('REALM_USER_COWORKERS_NO_SHIFTS');
                        }
                    }
                    else {
                        console.log('returning REALM_USER_NO_COWORKERS');
                        this.setLocalPersonaDisplayState('REALM_USER_NO_COWORKERS');
                    }
                }
                else {
                    console.log('returning REALM_NO_USER');
                    this.setLocalPersonaDisplayState('REALM_NO_USER');
                }
            }
            else {
                console.log('returning NO_REALM');
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

    }]);