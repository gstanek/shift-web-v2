
angular.module('myApp.shiftService', ['LocalStorageModule'])


.service('shiftService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {

    // Global User Object
    // Active User, with currently active realmID, personaID
    var user = {
        userID: '123456',
        firstName: 'Gabe',
        lastName: 'Stanek',
        preferredName: 'G-Money',
        email: 'gabe.stanek@gmail.com',
        realmID: '8900'
    };
    // Currently active realm
    var realm = {
        realmID: '8900',
        realmName: 'Joe\'s Pizza'
    }
    // Currently active persona
    var personas = [
        {
            personaID: '56789',
            roles: ['user', 'admin']
        },
        {
            personaID: '56789',
            roles: ['user', 'admin']
        }
    ];
    //
    var shiftsByActivePersona = [
        {
            shiftID: '1616',
            starttime: '01/29/16 01:30:00',
            endtime: '01/29/16 04:30:00',
            available: true,
            realmID: '8900',
            userID: '123456'
        },
        {
            shiftID: '1617',
            starttime: '01/30/16 01:30:00',
            endtime: '01/30/16 04:30:00',
            available: false,
            realmID: '8900',
            userID: '123456'
        },
        {
            shiftID: '1618',
            starttime: '02/05/16 01:30:00',
            endtime: '02/05/16 04:30:00',
            available: false,
            realmID: '8900',
            userID: '123456'
        }
    ];
    var shiftsByUser = [
        {
            shiftID: '1616',
            starttime: '01/29/16 01:30:00',
            endtime: '01/29/16 04:30:00',
            available: true,
            realmID: '8900',
            userID: '123456'
        },
        {
            shiftID: '1617',
            starttime: '01/30/16 01:30:00',
            endtime: '01/30/16 04:30:00',
            available: false,
            realmID: '8900',
            userID: '123456'
        },
        {
            shiftID: '1618',
            starttime: '02/05/16 01:30:00',
            endtime: '02/05/16 04:30:00',
            available: false,
            realmID: '8900',
            userID: '123456'
        }
    ];




    this.getAvailableShiftsByUserID = function(userID) {
        // First get shifts from in memory and return them


        // TODO SERVICE_LAYER
        // Make service layer call to get latest shifts for user, update view after we've refreshed
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
        if(user.persona != null) {
            userShifts = user.persona.shifts;

        };
        return userShifts;
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
        var availableShifts = {};
        var shifts = this.getActiveShifts();
        for(var i = 0; i<shifts.length; i++) {
            if(personaID == shift.userID + '-' + shift.realmID && shift.available == true) {
                availableShifts.push(shift);
            }
        }
        return availableShifts;
    };
    this.getShiftsByPersonaID = function(personaID) {

        var inMemShifts = this.getActiveShifts();
        if(!inMemShifts) {
            return personaShifts;
        }

        for(var i = 0; i<inMemShifts.length; i++) {
            if(personaID == inMemShifts[i].userID + '-' + inMemShifts[i].realmID) {
                personaShifts.push(inMemShifts[i]);
            }
        }
        return personaShifts;
    };

    var activeShifts = [];
    var personaShifts = [];
    var userShifts = [];

    this.getShifts = function() {
        var inMemShifts = this.getActiveShifts();
        if(!inMemShifts) {
            return activeShifts;
        };
        activeShifts = inMemShifts;

        return activeShifts;
    };

    // DATA ACCESS

    // 'HashMap' implementation
    var key = function(obj){
        // some unique object-dependent key
        return obj.id; // just an example
    };

    this.storeShift = function(shift) {
        console.log('store shift = ' + JSON.stringify(shift));
        activeShifts = this.getActiveShifts();
        if(!activeShifts) {
            activeShifts = [];
        }
        activeShifts.push(shift);

        //shifts[key(shift)] = shift;

        console.log('Shifts Set:' + JSON.stringify(activeShifts));
        localStorageService.set('shifts', activeShifts)
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT', activeShifts);
    };
    this.getActiveShifts = function() {
        var shifts = localStorageService.get('shifts');
        return shifts;
    };
    this.getShiftsByPersonaID = function(personaID) {
        return localStorageService.get('shifts');

    };
    this.removeShifts = function() {
        localStorageService.remove('shifts');
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT');
    };
}]);