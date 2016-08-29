angular.module("myApp.realmService",["LocalStorageModule","myApp.personaService"]).service("realmService",["$rootScope","localStorageService","personaService","$http","commonService","$websocket",function(a,b,c,d,e,f){this.createRealm=function(a){return d({method:"POST",url:"http://127.0.0.1:8000/api/v1/realm/",headers:{"Content-Type":"application/json"},data:a})},this.getRealmsByUser=function(){return d({method:"GET",url:"http://127.0.0.1:8000/api/v1/realm",headers:{"Content-Type":"application/json"}})},this.isActiveRealm=function(){var a=this.getLocalRealm();return null==a?!1:!0},this.getRealmName=function(){var a=this.getLocalRealm();return a&&a.name?a.name:"Company"},this.setRealmName=function(a,b){},this.getLocalRealm=function(){return b.get("realm")},this.setLocalRealm=function(c,d){b.set("realm",c),a.$broadcast("REALM_CHANGE_EVENT",c),d&&e.setPersonaDisplayState()},this.removeLocalRealm=function(c){b.remove("realm"),a.$broadcast("REALM_CHANGE_EVENT"),c&&e.setPersonaDisplayState()}}]);