angular.module("ShiftOnTapApp").service("authService",["$rootScope","localStorageService","userService","$auth","$http","$state","realmService","commonService","shiftService","personaService","RealmWebSocket",function(a,b,c,d,e,f,g,h,i,j,k){var l=this;this.validateAuthenticated=function(){var a=this.isAuthenticated();return a?!0:(f.go("home"),!1)},this.isAuthenticated=function(){var a=d.getToken(),b=this.getTokenExpirationTime(),c=new Date;if(a&&b){var e=Date.parse(b);return e>c.getTime()?!0:!1}return!1},this.isAuthorized=function(a){var b=c.getLocalUser(),d=null;return null!=b&&null!=b.persona&&(d=b.persona.roles),null!=d&&d.indexOf(a)>-1?!0:!1},this.clearUserContext=function(){d.removeToken(),b.clearAll();var c={type:"DELETE",value:void 0};a.$broadcast("USER_CHANGE_EVENT",c)},this.acceptInvite=function(b,c){var d="http://127.0.0.1:8000/api/v1/security/accept/",f={email:b.email,new_password:b.password,invite_code:c};e({method:"PATCH",url:d,headers:{"Content-Type":"application/json"},data:f}).then(function(a){console.log("Accept Invite Response:"+JSON.stringify(a)),l._initUserState(a.data)},function(b){var c={httpStatusCode:b.status,code:b.code,message:b.detail};a.$broadcast("AUTH_FAILURE_EVENT",c),l.clearUserContext()})},this.signup=function(b,c){var d="http://127.0.0.1:8000/api/v1/user/";b.timezone=moment.tz.guess(),e({method:"POST",url:d,headers:{"Content-Type":"application/json"},data:b}).then(function(a){l.clearUserContext(),l._initUserState(a.data)},function(b){a.$broadcast("AUTH_FAILURE_EVENT",b),l.clearUserContext()})},this.login=function(b){var c=({grant_type:"password",client_id:"AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE",username:b.email,password:b.password},"http://127.0.0.1:8000/api/v1/security/login?email="+b.email+"&password="+b.password);return e({method:"GET",url:c,headers:{"Content-Type":"application/json"}}).then(function(a){l._initUserState(a.data)},function(b){return a.$broadcast("AUTH_FAILURE_EVENT",b),b})},this._initUserState=function(d){var e={status:"success"};a.$broadcast("AUTH_SUCCESS_EVENT",e),l.setToken(d.access_token),l.setTokenExpirationTime(d.token_expiration_time),c.setLocalUser(d.user,!1),console.log("User="+JSON.stringify(b.get("user"))),d.realm&&(c.setLocalCoworkers(d.realm.users,!1),g.setLocalRealm(d.realm,!1),k.connect(),i.setLocalShifts(d.shifts,!0),j.setLocalPersona(d.persona,!1)),h.setPersonaDisplayState(),f.go("persona")},this.setToken=function(a){d.setToken(a)},this.logout=function(){var a=d.getToken(),b={grant_type:"password",client_id:"AiFijhEYAYAad9r6KgYAgFUN6B2dOMAuFBe60ucE",token:a};e({method:"POST",url:"http://localhost:8000/o/revoke_token/",headers:{"Content-Type":"application/x-www-form-urlencoded"},transformRequest:function(a){var b=[];for(var c in a)b.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return b.join("&")},data:b}).then(function(a){console.log("Success:"+JSON.stringify(a)),l.clearUserContext()},function(a){console.log("Failure:"+JSON.stringify(a))})},this.getBestDisplayName=function(){return null!=user.preferredName?user.preferredName:null!=user.firstName?user.firstName:null!=user.email?user.email:"Guest"},this.setTokenExpirationTime=function(a){b.set("token_expiration_time",a)},this.getTokenExpirationTime=function(){return b.get("token_expiration_time")},this.removeTokenExpirationTime=function(){b.remove("token_expiration_time")}}]).factory("httpInterceptor",["$q","$rootScope","commonService",function(a,b,c){return{request:function(a){return a.headers.Accept="application/json","application/x-www-form-urlencoded"!=a.headers["Content-Type"]&&(a.headers["Content-Type"]="application/json"),a},responseError:function(d){var e=c.generateErrorResponseObject(d);return 401==d.status?(b.$broadcast("UNAUTHORIZED_EVENT",{rejection:d}),a.reject(e)):a.reject(e)}}}]).config(["$httpProvider",function(a){a.interceptors.push("httpInterceptor")}]);