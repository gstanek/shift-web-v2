
angular.module('myApp.shiftService', ['LocalStorageModule'])


.service('shiftService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {

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
    var shift3 = {
        shiftID: '1618',
        starttime: '02/05/16 01:30:00',
        endtime: '02/05/16 04:30:00',
        available: false,
        realmID: '8900',
        userID: '123456'
    };
    var user = {
        userID: '123456',
        firstName: 'Gabe',
        lastName: 'Stanek',
        preferredName: 'G-Money',
        email: 'gabe.stanek@gmail.com',
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


    this.getAvailableShiftsByUserID = function(userID) {
        var availableShifts = [];

        if(user.persona != null) {
            var allShifts = user.persona.shifts;
            for (var i = 0; i < allShifts.length; i++) {
                if(allShifts[i].available == true) {
                    availableShifts.push(allShifts[i]);
                }
            }
        }
        return availableShifts;
    };
    this.getShiftsByUserID = function(userID) {
        var shifts = [];
        if(user.persona != null) {
            shifts = user.persona.shifts;

        };
        return shifts;
    };

    this.getAvailableShiftsByRealmID = function(realmID) {
        var availableShifts = [];

        if(user.persona != null) {
            var allShifts = user.persona.shifts;
            for (var i = 0; i < allShifts.length; i++) {
                if(allShifts[i].available == true) {
                    availableShifts.push(allShifts[i]);
                }
            }
        }
        return availableShifts;
    };
    this.getShiftsByRealmID = function(realmID) {
        var shifts = [];
        if(user.persona != null) {
            shifts = user.persona.shifts;

        };
        return shifts;
    };

    this.getAvailableShiftsByPersonaID = function(personaID) {
        var availableShifts = [];

        if(user.persona != null) {
            var allShifts = user.persona.shifts;
            for (var i = 0; i < allShifts.length; i++) {
                if(allShifts[i].available == true) {
                    availableShifts.push(allShifts[i]);
                }
            }
        }
        return availableShifts;
    };
    this.getShiftsByPersonaID = function(personaID) {
        var shifts = [];
        if(user.persona != null) {
            shifts = user.persona.shifts;

        };
        return shifts;
    };
}]);