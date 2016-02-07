
angular.module('myApp.authService', ['LocalStorageModule', 'myApp.userService'])


.service('authService', ['$rootScope', 'localStorageService', 'userService', function($rootScope, localStorageService, userService) {

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
        id: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        email: ''
    };

    var exampleuser = {
        userID: '',
        firstName: '',
        lastName: '',
        preferredName: '',
        email: '',
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

    this.isAuthenticated = function() {
        var activeUser = userService.getActiveUser();
        if(activeUser == null) {
            return false;
        }
        return true;
    };

    this.isAuthorized = function (requiredRole) {
        var activeUser = userService.getActiveUser();
        var roles = null;
        if(activeUser != null && activeUser.persona != null){
            roles = activeUser.persona.roles;
        }
        if (roles != null && roles.indexOf(requiredRole) > -1) {
            return true;
        } else {
            return false;
        }
    };

    this.signup = function(credentials) {
        //TODO SERVICE_LAYER Do signup request here
        console.log('signup service credentials=' + JSON.stringify(credentials))


        //TODO If signup success
        if(true) {
            //TODO replace with userID from response
            user = {};
            user.id = '23134543';
            user.email = credentials.email;
            userService.setActiveUser(user);
            return user;
        }
        else {
            //TODO on failure, fire event
            return null;
        }
    };

    this.login = function(credentials) {
        //TODO SERVICE_LAYER Do login request here

        user.email = credentials.email;


        //TODO If login success
        if(true) {
            userService.setActiveUser(user);
            return true;
        }
        else {
            return false;
        }
    };
    this.logout = function() {
        //TODO SERVICE_LAYER make logout request here

        userService.removeActiveUser();
    }


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

    this.getCompanyName = function() {
        if(user.persona != null && user.persona.realm != null) {
            if(user.persona.realm.realmName) {
                return user.persona.realm.realmName;
            }
            return 'Company';
        }
        return 'Company';
    };

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

    this.getShifts = function() {
        var shifts = [];
        if(user.persona != null) {
            shifts = user.persona.shifts;

        };
        return shifts;
    };

    this.setIdentityMap = function(user) {
        localStorageService.set('user', user)
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
    this.getIdentityMap = function() {
        return localStorageService.get('user');
    };
    this.removeActiveUser = function() {
        localStorageService.remove('user');
        $rootScope.$broadcast('USER_CHANGE_EVENT', user);
    };
}]);