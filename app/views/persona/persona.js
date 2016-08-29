'use strict';

angular.module('myApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
      .state('persona', {
        url: '/persona',
        templateUrl: 'views/persona/persona.html',
        controller: 'PersonaCtrl'
      });
}])
.controller('PersonaCtrl', ['$scope', '$uibModal', 'commonService', 'shiftService',
    function($scope, $uibModal, commonService, shiftService) {

    $scope.personaDisplayState = commonService.getLocalPersonaDisplayState();
    $scope.$on('PERSONA_DISPLAY_STATE_CHANGE_EVENT', function(personaState) {
        $scope.personaDisplayState = commonService.getLocalPersonaDisplayState();
    });

    $scope.availableShifts = shiftService.getLocalShifts();
    $scope.$on('SHIFT_CHANGE_EVENT', function() {
        $scope.availableShifts = shiftService.getLocalShifts();
    });


    // Start Modal Logic
    $scope.modal = {
        instance: null
    };
    $scope.open = function () {
        $scope.modal.instance = $uibModal.open({
            animation: true,
            template: '<my-modal modal="modal"></my-modal>',
            scope : $scope
        });
    };
    // End Modal Logic

}]);