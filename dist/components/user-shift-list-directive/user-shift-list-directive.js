angular.module("myApp").directive("userShiftListDirective",["realmService","userService","shiftService","RealmWebSocket",function(a,b,c,d){return{scope:{userShiftListInfo:"=userShiftListModel"},templateUrl:"components/user-shift-list-directive/user-shift-list.html",link:function(a){a.reclaim=function(a){b(a,!1)},a.markAvailable=function(a){b(a,!0)};var b=function(a,b){var d={available:b};c.updateShift(a,d).then(function(a){console.log("Success:"+JSON.stringify(a))},function(a){console.log("Failure:"+JSON.stringify(a))})};a["delete"]=function(a){c.deleteShift(a).then(function(b){console.log("Success:"+JSON.stringify(b)),c.removeLocalShift(a,!0)},function(b){404==b.status&&c.removeLocalShift(a,!0),console.log("Failure:"+JSON.stringify(b))})},a.getShiftDisplayMode=function(a){return a.available?"panel-warning":"panel-default"},a.$on("SHIFT_CHANGE_EVENT",function(){a.availableShifts=c.getLocalShifts()});var d=function(){a.availableShifts=c.getLocalShifts()};d()}}}]);