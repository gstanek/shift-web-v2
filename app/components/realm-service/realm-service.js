
angular.module('myApp.realmService', ['LocalStorageModule', 'myApp.personaService'])


.service('realmService', ['$rootScope', 'localStorageService', 'personaService', '$http', function($rootScope, localStorageService, personaService, $http) {

    /**
     * Create a new realm
     * @param realm to be created
     * @returns {realm} resulting realm or null
     */
    this.createRealm = function(realm) {
        return $http({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/realm/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: realm
        });
    }

    /**
     * Exposes active realm
     * @returns {getLocalRealm|*}
     */
    this.isActiveRealm = function() {
        var activeRealm = this.getLocalRealm();
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
        var realm = this.getLocalRealm();
        if(realm) {
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

    this.getLocalRealm = function() {
        return localStorageService.get('realm');
    };
    this.setLocalRealm = function(realm) {
        localStorageService.set('realm', realm)
        $rootScope.$broadcast('REALM_CHANGE_EVENT', realm);
    };
    this.removeLocalRealm = function() {
        localStorageService.remove('realm');
        $rootScope.$broadcast('REALM_CHANGE_EVENT');
    };
}]);