"use strict";angular.module("myApp").config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("persona",{url:"/persona",templateUrl:"views/persona/persona.html",controller:"PersonaCtrl"})}]).controller("PersonaCtrl",["$scope","$uibModal","commonService","shiftService",function(a,b,c,d){a.personaDisplayState=c.getLocalPersonaDisplayState(),a.$on("PERSONA_DISPLAY_STATE_CHANGE_EVENT",function(b){a.personaDisplayState=c.getLocalPersonaDisplayState()}),a.availableShifts=d.getLocalShifts(),a.$on("SHIFT_CHANGE_EVENT",function(){a.availableShifts=d.getLocalShifts()}),a.modal={instance:null},a.open=function(){a.modal.instance=b.open({animation:!0,template:'<my-modal modal="modal"></my-modal>',scope:a})}}]);