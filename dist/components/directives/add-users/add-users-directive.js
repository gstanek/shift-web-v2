angular.module("ShiftOnTapApp").directive("addUsersDirective",["userService","realmService","shiftService","Notification",function(a,b,c,d){return{restrict:"E",scope:{ok:"&onOk",cancel:"&onCancel"},templateUrl:"components/directives/add-users/add-users.html",link:function(e,f,g,h){e.isActiveRealm=b.isActiveRealm();var i=function(){var b=a.getLocalUser();if(b){var d=c.getLocalShifts();return d?!0:!1}return!1};e.isShiftPresent=function(){return i()},e.userAttributes=[{Name:"firstName",Required:!0},{Name:"lastName",Required:!0},{Name:"email",Required:!0}],e.companyName=b.getRealmName(),e.formData={users:[{}],index:0},e.addAnother=function(){e.formData.users.push({})},e.removeIndex=function(a){console.log("index="+a),a>-1&&e.formData.users.splice(a,1)},e.addUsers=function(c){if(console.log("scope.formData="+JSON.stringify(e.formData)),c.$valid){var f=b.getLocalRealm(),g=f.id;console.log("users to add: "+JSON.stringify(e.formData.users));var h={realm_id:g,users:e.formData.users};a.createUsers(h).then(function(a){d.success("Co-workers Invited"),e.ok()},function(a){e.errorObj={detail:a.error.message}})}else c.$setSubmitted(),e.errorObj={detail:"Please correct errors indicated above and resubmit"}}}}}]);