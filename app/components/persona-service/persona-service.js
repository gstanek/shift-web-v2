
angular.module('myApp.personaService', ['LocalStorageModule', 'myApp.userService'])


.service('personaService', ['$rootScope', 'localStorageService', 'userService', function($rootScope, localStorageService, userService) {



    /**
     * Service to access the PersonaID of the current active user/realm combination
     *
     * @returns {string}
     */
    this.getPersonaID = function() {
        //TODO Get Current PersonaID and return it
        return "fakePersonaID";
    }

    /**
     * Creates a new persona to match current user and realm
     *
     * @param realmID
     * @returns {persona} created persona
     */
    this.createPersona = function(realmID) {
        var persona = {
            id : '',
            roles : ['admin']
        };
        persona.id = userService.getLocalUser() + '-' + realmID;

        //TODO SERVICE_LAYER create persona in backend
        if(true) {
            this.setActivePersona(persona);
            return persona;
        }
        else {
            return null;
        }
    }

    this.setActivePersona = function(persona) {
        localStorageService.set('persona', persona)
        $rootScope.$broadcast('PERSONA_CHANGE_EVENT', persona);
    };
    this.getActivePersona = function() {
        return localStorageService.get('persona');
    };
    this.removeActivePersona = function() {
        localStorageService.remove('persona');
        $rootScope.$broadcast('PERSONA_CHANGE_EVENT', persona);
    };
}]);