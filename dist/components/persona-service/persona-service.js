angular.module("myApp.personaService",["LocalStorageModule","myApp.userService"]).service("personaService",["$rootScope","localStorageService","userService",function(a,b,c){this.getPersonaID=function(){return"fakePersonaID"},this.createPersona=function(a){var b={id:"",roles:["admin"]};return b.id=c.getLocalUser()+"-"+a,this.setActivePersona(b),b},this.setActivePersona=function(c){b.set("persona",c),a.$broadcast("PERSONA_CHANGE_EVENT",c)},this.getActivePersona=function(){return b.get("persona")},this.removeActivePersona=function(){b.remove("persona"),a.$broadcast("PERSONA_CHANGE_EVENT",persona)}}]);