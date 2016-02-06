
angular.module('myApp.userService', ['LocalStorageModule'])


.service('userService', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {

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



    this.getBestDisplayName = function() {
        if(user.preferredName != null) {
            return user.preferredName;
        }
        else if(user.firstName != null) {
            return user.firstName;
        }
        else if(user.email != null) {
            return user.email;
        }
        else {
            return 'Guest';
        }
    };


    /**
     * Service Exposed to return all available shifts associated with given user
     *
     * @returns {Array} of Available Shifts associated with user
     */
    this.getAvailableShifts = function() {
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

    /**
     * Service Exposed to return all shifts associated with given user
     *
     * @returns {Array} of Shifts associated with user
     */
    this.getShifts = function() {
        var shifts = [];
        if(user.persona != null) {
            shifts = user.persona.shifts;

        };
        return shifts;
    };

    this.setActiveUser = function(user) {
        localStorageService.set('user', user)
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
    this.getActiveUser = function() {
        return localStorageService.get('user');
    };
    this.removeActiveUser = function() {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
}]);