
angular.module('ShiftOnTapApp')


.service('realmService', ['$rootScope', 'localStorageService', 'personaService', '$http', 'commonService', '$websocket', '$q',
    function($rootScope, localStorageService, personaService, $http, commonService, $websocket, $q) {

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

    this.getRealmByRealmID = function(realmID) {
        return $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/realm/' + realmID,
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function successCallback(response) {
            return response.data;
        }).catch(function errorCallback(response) {
            return $q.reject(response);
        });
    }

    this.getRealmsByUser = function() {
        return $http({
            method: 'GET',
            url: 'http://127.0.0.1:8000/api/v1/realm/',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function successCallback(response) {
            return response.data;
        }).catch(function errorCallback(response) {
            return $q.reject(response);
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
    this.setLocalRealm = function(realm, updatePersonaDisplayState) {
        localStorageService.set('realm', realm)
        $rootScope.$broadcast('REALM_CHANGE_EVENT', realm);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };

    this.getLocalRealms = function() {
        return localStorageService.get('realms');
    };
    this.setLocalRealms = function(realms, updatePersonaDisplayState) {
        localStorageService.set('realms', realms)
        $rootScope.$broadcast('REALM_CHANGE_EVENT', realms);
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };

    this.removeLocalRealm = function(updatePersonaDisplayState) {
        localStorageService.remove('realm');
        $rootScope.$broadcast('REALM_CHANGE_EVENT');
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();    
        }
    };
}]);