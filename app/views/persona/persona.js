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
.controller('PersonaCtrl', ['$scope', '$uibModal', 'commonService', 'shiftService', 'userService',
    function($scope, $uibModal, commonService, shiftService, userService) {
    "ngInject";
    $scope.personaDisplayState = commonService.getLocalPersonaDisplayState();
    $scope.$on('PERSONA_DISPLAY_STATE_CHANGE_EVENT', function(event, personaState) {
        $scope.personaDisplayState = personaState;
        // $scope.personaDisplayState = commonService.getLocalPersonaDisplayState();
    });

    $scope.availableShifts = shiftService.getLocalShifts();
    $scope.$on('SHIFT_CHANGE_EVENT', function(event, shifts) {
        // $scope.availableShifts = shiftService.getLocalShifts();
        $scope.availableShifts = shifts;
    });
    $scope.$on('COWORKER_CHANGE_EVENT', function(event, coworkers) {
        $scope.coworkers = coworkers;
    });

    $scope.getBestDisplayName = function(coworker) {
        if(coworker.preferred_name) {
            return coworker.preferred_name + ' ' + coworker.last_name;
        }
        else {
            return coworker.first_name + ' ' + coworker.last_name;
        }
    };

    $scope.coworkers = userService.getLocalCoworkers();
    $scope.activeUser = userService.getLocalUser();

    var init = function(){
        $scope.coworkers = userService.getLocalCoworkers();
    }
    init();

    // Start Modal Logic
    $scope.modal = {
        instance: null
    };

    $scope.errorObj = {
        detail: '',
        code: 0
    }
    $scope.openAddShiftModal = function () {
        $scope.errorObj.detail='';
        $scope.errorObj.code=0;
        $scope.modal.instance = $uibModal.open({
            animation: true,
            template: '<shift-modal modal="modal" error-obj="errorObj"></shift-modal>',
            scope : $scope
        });
    };

    $scope.modal2 = {
        instance: null
    };
    $scope.openAddUsersModal = function () {
        $scope.errorObj.detail='';
        $scope.errorObj.code=0;
        $scope.modal2.instance = $uibModal.open(/*@ngInject*/{
            animation: true,
            template: '<add-users-modal modal2="modal2" error-obj="errorObj"></add-users-modal>',
            scope : $scope
        });
    };
    // End Modal Logic

}]);