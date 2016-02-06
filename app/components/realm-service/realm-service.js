
angular.module('myApp.realmService', ['LocalStorageModule', 'myApp.personaService'])


.service('realmService', ['$rootScope', 'localStorageService', 'personaService', function($rootScope, localStorageService, personaService) {

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

    //realm: {
    //    realmID: '8900',
    //        realmName: 'Joe\'s Pizza'
    //}


    /**
     * Create a new realm
     * @param realm to be created
     * @returns {realm} resulting realm or null
     */
    this.createRealm = function(realm) {
        // TODO SERVICE_LAYER Send request to create realm
        console.log('In realm-service CreateRealm');

        // If success store realm in localstorage
        if(true) {
            //TODO set ID based on response
            realm.id = '11223344';
            this.setLocalActiveRealm(realm);
            personaService.createPersona(realm.id);
            return realm;
        }
        else {
            return null;
        }
    }

    /**
     * Exposes active realm
     * @returns {getLocalActiveRealm|*}
     */
    this.isActiveRealm = function() {
        var activeRealm = this.getLocalActiveRealm();
        if(activeRealm == null) {
            return false;
        }
        return true;
    }

    /**
     * Get the name associated with the passed in ID
     * @param realmID
     * @returns {String} as realm name
     */
    this.getRealmName = function() {
        var realm = this.getLocalActiveRealm();
        if(realm) {
            console.log('in realm block:' + realm + '.');
            if(realm.name) {
                return realm.name;
            }
            return 'Company';

        }
        else {
            //TODO SERVICE_LAYER look up realm in backend
            //Store realm in local storage if found
            //User result for name response if success.
            if(true) {
                return 'Company';
            }
        }
    };

    this.setRealmName = function(realmID, name) {

    }

    this.getLocalActiveRealm = function() {
        return localStorageService.get('realm');
    };
    this.setLocalActiveRealm = function(realm) {
        localStorageService.set('realm', realm)
        $rootScope.$broadcast('REALM_CHANGE_EVENT', realm);
    };
    this.removeLocalActiveRealm = function() {
        localStorageService.remove('realm');
        $rootScope.$broadcast('REALM_CHANGE_EVENT');
    };
}]);