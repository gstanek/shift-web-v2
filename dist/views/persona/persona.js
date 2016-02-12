"use strict";angular.module("myApp.persona",["ui.router","myApp.realmService","myApp.ngAutocomplete"]).config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("persona",{url:"/persona",templateUrl:"views/persona/persona.html",controller:"PersonaCtrl"})}]).controller("PersonaCtrl",["$scope","$http","authService","realmService","userService","shiftService",function(a,b,c,d,e,f){a.isActiveRealm=d.isActiveRealm(),a.$on("REALM_CHANGE_EVENT",function(){a.isActiveRealm=d.isActiveRealm()}),a.$on("SHIFT_CHANGE_EVENT",function(){a.isShiftPresent=function(){return g()},a.availableShifts=f.getShifts()}),a.isShiftPresent=function(){return g()};var g=function(){var a=e.getActiveUser(),b=f.getShiftsByPersonaID(a.id+"-"+a.realmID);return b?!0:!1};a.radioModel="employee",a.$watchCollection("checkModel",function(){a.checkResults=[],angular.forEach(a.checkModel,function(b,c){b&&a.checkResults.push(c)})}),a.newRealmFormModel={name:"",address:"",manager:""},a.createRealm=function(){var b={name:a.newRealmFormModel.name,manager:a.newRealmFormModel.manager,address:a.address};d.createRealm(b)},a.result="",a.options={watchEnter:!0,types:"address"},a.address={},a.addressFound="",a.companyName=d.getRealmName(),a.newShiftModel={id:"",dateRangeStart:"",dateRangeEnd:"",comments:""},a.createShift=function(){console.log("In createShift Function.  newShiftForm Data: "+JSON.stringify(a.newShiftModel)),a.newShiftModel.id="123456",f.storeShift(a.newShiftModel),a.availableShifts.push(a.newShiftModel)},a.beforeRenderStartDate=function(b,c,d,e,f){if(a.dateRangeEnd)for(var g=moment(a.dateRangeEnd),h=0;h<c.length;h++)c[h].localDateValue()>=g.valueOf()&&(c[h].selectable=!1)},a.beforeRenderEndDate=function(b,c,d,e,f){if(a.dateRangeStart)for(var g=moment(a.dateRangeStart).subtract(1,b).add(1,"minute"),h=0;h<c.length;h++)c[h].localDateValue()<=g.valueOf()&&(c[h].selectable=!1)},a.reclaim=function(a){console.log("in reclaim "+a)},a.markAvailable=function(a){console.log("in markAvailable "+a)},a["delete"]=function(a){console.log("in delete "+a)},a.availableShifts=[],a.getAvailableShifts=function(){return f.getShifts()}}]);