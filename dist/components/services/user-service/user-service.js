angular.module("ShiftOnTapApp").service("userService",["$rootScope","localStorageService","$http","commonService","$q",function(a,b,c,d,e){var f=this;this.updateUser=function(a){return c({method:"PATCH",url:"http://127.0.0.1:8000/api/v1/user/"+a.id,headers:{"Content-Type":"application/json"},data:a}).then(function(a){return f.setLocalUser(a.data,!0),a.data})["catch"](function(a){return e.reject(a)})},this.createUsers=function(a){for(var b=moment.tz.guess(),d=0;d<a.users.length;d++)a.users[d].timezone=b;return c({method:"POST",url:"http://127.0.0.1:8000/api/v1/user/bulk",headers:{"Content-Type":"application/json"},data:a}).then(function(a){return f.addLocalCoworkers(a.data,!0),a.data})["catch"](function(a){return e.reject(a)})},this.verifyInvitee=function(a,b){var d="http://127.0.0.1:8000/api/v1/user/invite/email/"+a+"/code/"+b;return c({method:"GET",url:d}).then(function(a){return a.data})["catch"](function(a){return e.reject(a)})},this.getBestDisplayName=function(){var a=f.getLocalUser();return a?a.preferred_name?a.preferred_name:a.first_name?a.first_name:a.email?a.email:"Guest":""},this.addLocalCoworkers=function(c,e){var f=b.get("coworkers");if(null!=f){for(var g=c.length,h=0;g>h;h++)f.push(c[h]);b.set("coworkers",f),a.$broadcast("COWORKER_CHANGE_EVENT",f)}else b.set("coworkers",c),a.$broadcast("COWORKER_CHANGE_EVENT",c);e&&d.setPersonaDisplayState()},this.setLocalCoworkers=function(c,e){b.set("coworkers",c),a.$broadcast("COWORKER_CHANGE_EVENT",c),e&&(console.log("Update Persona Display State persona state update"),d.setPersonaDisplayState())},this.getLocalCoworkers=function(){return b.get("coworkers")},this.getLocalTimezone=function(){return b.get("timezone")},this.removeLocalCoworkers=function(a){b.remove("coworkers"),a&&d.setPersonaDisplayState()},this.setLocalUser=function(c,e){b.set("user",c);var f={type:"UPDATE",value:c};a.$broadcast("USER_CHANGE_EVENT",f),e&&d.setPersonaDisplayState()},this.getLocalUser=function(){return b.get("user")},this.removeLocalUser=function(c){b.remove("user");var e={type:"DELETE",value:void 0};a.$broadcast("USER_CHANGE_EVENT",e),c&&d.setPersonaDisplayState()}}]);