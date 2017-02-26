
angular.module('ShiftOnTapApp')


.service('personaService', ['$rootScope', 'localStorageService', 'commonService',
function($rootScope, localStorageService, commonService) {

    this.setLocalPersona = function(persona, updatePersonaDisplayState) {
        localStorageService.set('persona', persona)
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
    this.getLocalPersona = function() {
        return localStorageService.get('persona');
    };
    this.removeLocalPersona = function(updatePersonaDisplayState) {
        localStorageService.remove('persona');
        if(updatePersonaDisplayState) {
            commonService.setPersonaDisplayState();
        }
    };
}]);