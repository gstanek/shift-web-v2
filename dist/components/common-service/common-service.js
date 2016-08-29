angular.module("myApp.commonService",[]).service("commonService",["localStorageService","$rootScope",function(a,b){this.setPersonaDisplayState=function(){var a=this.getLocalRealm();if(a){var b=this.getLocalUser();if(b){var c=this.getLocalCoworkers();if(c&&c.length>1){var d=this.getLocalShifts();d?(console.log("returning REALM_USER_COWORKERS_SHIFTS"),this.setLocalPersonaDisplayState("REALM_USER_COWORKERS_SHIFTS")):(console.log("returning REALM_USER_COWORKERS_NO_SHIFTS"),this.setLocalPersonaDisplayState("REALM_USER_COWORKERS_NO_SHIFTS"))}else console.log("returning REALM_USER_NO_COWORKERS"),this.setLocalPersonaDisplayState("REALM_USER_NO_COWORKERS")}else console.log("returning REALM_NO_USER"),this.setLocalPersonaDisplayState("REALM_NO_USER")}else console.log("returning NO_REALM"),this.setLocalPersonaDisplayState("NO_REALM")},this.getLocalPersonaDisplayState=function(){return a.get("persona_display_state")},this.setLocalPersonaDisplayState=function(c){a.set("persona_display_state",c),b.$broadcast("PERSONA_DISPLAY_STATE_CHANGE_EVENT",c)},this.removeLocalPersonaDisplayState=function(){a.remove("persona_display_state"),b.$broadcast("PERSONA_DISPLAY_STATE_CHANGE_EVENT")},this.getLocalRealm=function(){return a.get("realm")},this.getLocalShifts=function(){var b=a.get("shifts");return b&&0==b.length?null:b},this.getLocalCoworkers=function(){return a.get("coworkers")},this.getLocalUser=function(){return a.get("user")}}]);