'use strict';

angular.module('ShiftOnTapApp')
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {
  $stateProvider
      .state('persona', {
        url: '/persona',
        templateUrl: 'views/persona/persona.html',
        controller: 'PersonaCtrl'
      });
}])
.controller('PersonaCtrl', ['$scope', '$uibModal', 'commonService', 'shiftService', 'userService',
    function($scope, $uibModal, commonService, shiftService, userService) {
    "ngInject";

    $scope.$on('PERSONA_DISPLAY_STATE_CHANGE_EVENT', function(event, personaState) {
        $scope.personaDisplayState = personaState;
    });
    $scope.$on('SHIFT_CHANGE_EVENT', function(event, shifts) {
        $scope.availableShifts = shifts;
    });
    $scope.$on('COWORKER_CHANGE_EVENT', function(event, coworkers) {
        $scope.coworkers = coworkers;
    });

    var init = function(){
        $scope.coworkers = userService.getLocalCoworkers();
        $scope.personaDisplayState = commonService.getLocalPersonaDisplayState();
        $scope.availableShifts = shiftService.getLocalShifts();
        $scope.getBestDisplayName = function(coworker) {
            if(coworker.preferred_name) {
                return coworker.preferred_name + ' ' + coworker.last_name;
            }
            else {
                return coworker.first_name + ' ' + coworker.last_name;
            }
        };
        $scope.activeUser = userService.getLocalUser();
    }
    init();

    // Start Modal Logic
    $scope.addShiftModal = {
        instance: null
    };
    $scope.errorObj = {
        detail: '',
        code: 0
    }
    $scope.openAddShiftModal = function () {
        $scope.errorObj.detail='';
        $scope.errorObj.code=0;
        $scope.addShiftModal.instance = $uibModal.open({
            animation: true,
            template: '<shift-modal modal="addShiftModal" error-obj="errorObj"></shift-modal>',
            scope : $scope
        });
    };

    $scope.addUsersModal = {
        instance: null
    };
    $scope.openAddUsersModal = function () {
        $scope.addUsersModal.instance = $uibModal.open(/*@ngInject*/{
            animation: true,
            template: '<add-users-modal modal="addUsersModal"></add-users-modal>',
            scope : $scope
        });
    };
    // End Modal Logic

}]);