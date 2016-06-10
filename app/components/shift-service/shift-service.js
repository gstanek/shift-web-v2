
angular.module('myApp.shiftService', ['LocalStorageModule'])


.service('shiftService', ['$rootScope', 'localStorageService', '$http', 'realmService', function($rootScope, localStorageService, $http, realmService) {

    var realm = {}
    var personas = [];
    var shiftsByActivePersona = [];
    var shiftsByUser = [];




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
        var shifts = this.getLocalShifts();
        for(var i = 0; i<shifts.length; i++) {
            if(personaID == shift.userID + '-' + shift.realmID && shift.available == true) {
                availableShifts.push(shift);
            }
        }
        return availableShifts;
    };
    this.getShiftsByPersonaID = function(personaID) {

        var inMemShifts = this.getLocalShifts();
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


    var personaShifts = [];
    var userShifts = [];

    this.getShifts = function() {
        var realm = realmService.getLocalRealm();
        var realmQueryParam = '';
        if(realm) {
            realmQueryParam = '?realm_id=' + realm.id;
        }
        return $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/shift' + realmQueryParam,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        /*var shifts = [];
        var inMemShifts = this.getActiveShifts();
        if(!inMemShifts) {
            return shifts;
        };
        shifts = inMemShifts;

        return shifts;*/
    };

    // DATA ACCESS

    // 'HashMap' implementation
    /*var key = function(obj){
        // some unique object-dependent key
        return obj.id; // just an example
    };*/

    this.updateShift = function(id, shift) {
        return $http({
            method: 'PATCH',
            url: 'http://127.0.0.1:8000/api/v1/shift/' + id,
            headers: {
                'Content-Type': 'application/json'
            },
            data: shift
        });
    }

    this.storeShift = function(shift) {
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/shift/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: shift
        });
    };

    this.deleteShift = function(shiftID) {
        return $http({
            method: 'DELETE',
            url: 'http://127.0.0.1:8000/api/v1/shift/' + shiftID,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    this.storeLocalShift = function(shift) {
        var activeShifts = this.getLocalShifts();
        if(!activeShifts) {
            activeShifts = [];
        }
        removeByAttr(activeShifts, 'id', shift.id);
        activeShifts.push(shift);
        localStorageService.set('shifts', activeShifts)
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT', activeShifts);
    };
    this.removeLocalShift = function(shiftID) {
        var activeShifts = this.getLocalShifts();
        if(!activeShifts) {
            activeShifts = [];
        }
        removeByAttr(activeShifts, 'id', shift.id);
        localStorageService.set('shifts', activeShifts)
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT', activeShifts);
    };
    this.storeLocalShifts = function(shifts) {
        localStorageService.set('shifts', shifts)
    };
    this.getLocalShifts = function() {
        var shifts = localStorageService.get('shifts');
        return shifts;
    };
    this.getShiftsByPersonaID = function(personaID) {
        return localStorageService.get('shifts');
    };
    this.removeLocalShift = function(shiftID) {
        var shifts = this.getLocalShifts();

        localStorageService.remove('shifts');
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT');
    };
    this.removeLocalShifts = function() {
        localStorageService.remove('shifts');
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT');
    };

    // Helper Method to remove item from array
    var removeByAttr = function(arr, attr, value){
        var i = arr.length;
        while(i--){
            if( arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value ) ){

                arr.splice(i,1);

            }
        }
        return arr;
    }
}]);