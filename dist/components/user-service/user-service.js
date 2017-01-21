angular.module("ShiftOnTapApp").service("userService",["$rootScope","localStorageService","$http","commonService","Notification",function(a,b,c,d,e){var f=this;this.updateUser=function(a){return c({method:"PATCH",url:"http://127.0.0.1:8000/api/v1/user/"+a.id,headers:{"Content-Type":"application/json"},data:a}).then(function(a){return f.setLocalUser(a.data,!0),a.data})["catch"](function(a){var b=d.generateErrorResponseObject(a);throw b})},this.createUsers=function(a){return c({method:"POST",url:"http://127.0.0.1:8000/api/v1/user/bulk",headers:{"Content-Type":"application/json"},data:a})},this.verify_invitee=function(b,e){var f="http://127.0.0.1:8000/api/v1/user/invite/email/"+b+"/code/"+e;c({method:"GET",url:f,headers:{"Content-Type":"application/json"}}).then(function(b){console.log("Verify Invite Success: "+JSON.stringify(b));var c=d.generateResponseObject(b);a.$broadcast("INVITE_EVENT",c)},function(b){console.log("Verify Invite Error: "+JSON.stringify(b));var c=d.generateErrorResponseObject(b);a.$broadcast("INVITE_EVENT",c)})},this.getBestDisplayName=function(){var a=this.getLocalUser();return a?a.preferred_name?a.preferred_name:a.first_name?a.first_name:a.email?a.email:"Guest":""},this.addLocalCoworkers=function(c,e){var f=b.get("coworkers");if(null!=f){for(var g=c.length,h=0;g>h;h++)f.push(c[h]);b.set("coworkers",f)}else b.set("coworkers",c);a.$broadcast("COWORKER_CHANGE_EVENT",c),e&&d.setPersonaDisplayState()},this.setLocalCoworkers=function(c,e){b.set("coworkers",c),a.$broadcast("COWORKER_CHANGE_EVENT",c),e&&(console.log("Update Persona Display State persona state update"),d.setPersonaDisplayState())},this.getLocalCoworkers=function(){return b.get("coworkers")},this.removeLocalCoworkers=function(a){b.remove("coworkers"),a&&d.setPersonaDisplayState()},this.setLocalUser=function(c,e){b.set("user",c);var f={type:"UPDATE",value:c};a.$broadcast("USER_CHANGE_EVENT",f),e&&d.setPersonaDisplayState()},this.getLocalUser=function(){return b.get("user")},this.removeLocalUser=function(c){b.remove("user");var e={type:"DELETE",value:null};a.$broadcast("USER_CHANGE_EVENT",e),c&&d.setPersonaDisplayState()}}]);