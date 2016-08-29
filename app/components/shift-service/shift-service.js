
angular.module('myApp.shiftService', ['LocalStorageModule'])


.service('shiftService', ['$rootScope', 'localStorageService', '$http', 'realmService', 'commonService',
    function($rootScope, localStorageService, $http, realmService, commonService) {

    var self = this;

    this.getShifts = function(triggerEvent) {
        var realm = realmService.getLocalRealm();
        var realmQueryParam = '';
        if(realm) {
            realmQueryParam = '?realm_id=' + realm.id;
        }
        $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/shift' + realmQueryParam,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function successCallback(getShiftsResponse) {
            console.log('Success:' + JSON.stringify(getShiftsResponse));
            self.setLocalShifts(getShiftsResponse.data, triggerEvent);
        }, function errorCallback(getShiftsResponse) {
            console.log('Failure to Get Shifts:' + JSON.stringify(getShiftsResponse));
            alert('Something went wrong during the signup process.  Please try again.  If the problem persists, please check back later.');
        });;
    };

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

    this.storeShift = function(shiftDetails) {
        var realm = realmService.getLocalRealm();
        // Construct Date
        console.log('startDate = ' + JSON.stringify(shiftDetails.startDate));
        console.log('endDate = ' + JSON.stringify(shiftDetails.endDate));

        var parsedStartDate = shiftDetails.startDate;
        parsedStartDate.setHours(shiftDetails.startTime.getHours());
        parsedStartDate.setMinutes(shiftDetails.startTime.getMinutes());
        parsedStartDate.setSeconds(0);
        parsedStartDate.setMilliseconds(0);

        var parsedEndDate = shiftDetails.endDate;
        parsedEndDate.setHours(shiftDetails.endTime.getHours());
        parsedEndDate.setMinutes(shiftDetails.endTime.getMinutes());
        parsedEndDate.setSeconds(0);
        parsedEndDate.setMilliseconds(0);

        console.log('parsedStartDate = ' + JSON.stringify(parsedStartDate));
        console.log('parsedEndDate = ' + JSON.stringify(parsedEndDate));

        var shift = {
            start_datetime : parsedStartDate,
            end_datetime : parsedEndDate,
            available : false,
            realm : realm.id,
            comment : shiftDetails.comment
        };
        console.log('shift = ' + JSON.stringify(shift));

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

    /**
     * Local Methods ...
     *
     */

    this.setLocalShift = function(shift, updatePersonaDisplayState) {
        var activeShifts = this.getLocalShifts();
        if(!activeShifts) {
            activeShifts = [];
        }
        removeByAttr(activeShifts, 'id', shift.id);
        activeShifts.push(shift);
        localStorageService.set('shifts', activeShifts)
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT', activeShifts);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
    this.removeLocalShift = function(shiftID, updatePersonaDisplayState) {
        var activeShifts = this.getLocalShifts();
        if(!activeShifts) {
            activeShifts = [];
        }
        removeByAttr(activeShifts, 'id', shiftID);
        localStorageService.set('shifts', activeShifts)
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT', activeShifts);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
    this.setLocalShifts = function(shifts, updatePersonaDisplayState) {
        localStorageService.set('shifts', shifts);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
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
    this.removeLocalShifts = function(updatePersonaDisplayState) {
        localStorageService.remove('shifts');
        $rootScope.$broadcast('SHIFT_CHANGE_EVENT');
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
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