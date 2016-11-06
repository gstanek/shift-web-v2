angular.module('myApp.addUsersDirective', [])
.directive('addUsersDirective', ['userService', 'realmService', 'shiftService', 'commonService',
    function(userService, realmService, shiftService, commonService) {
    return {
        restrict: 'E',
        // transclude: true,
        scope: {
            modal: '=',
            'save': '&onSave',
            'cancel': '&onCancel'
        },
        templateUrl: 'components/add-users/add-users.html',
        link: function (scope, element, attrs, ngModel) {
            scope.isActiveRealm = realmService.isActiveRealm();
            var isShiftPresent = function() {
                var user = userService.getLocalUser();
                if(user) {
                    var shifts = shiftService.getLocalShifts();
                    if(shifts) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            };
            scope.isShiftPresent = function() {
                return isShiftPresent();
            }

            scope.companyName = realmService.getRealmName();
            scope.formData = {
                users : [{},{},{}]
            };
            scope.addUsers = function() {
                var realm = realmService.getLocalRealm();
                var realm_id = realm.id;
                var cleanedUsers = [];
                for(var i = 0; i < scope.formData.users.length; i++) {
                    console.log('formUser:' + JSON.stringify(scope.formData.users[i]));
                    if(scope.formData.users[i].email && scope.formData.users[i].first_name) {
                        cleanedUsers.push(scope.formData.users[i]);
                    }
                }
                var usersDAO = {
                    realm_id : realm_id,
                    users : cleanedUsers
                };
                userService.createUsers(usersDAO)
                    .then(function successCallback(response) {
                        console.log('Add Users Success:' + JSON.stringify(response));
                        userService.setLocalCoworkers(usersDAO.users, true);
                        scope.save();
                    }, function errorCallback(response) {
                        console.log('Add Users Failure:' + JSON.stringify(response));
                    });
            };
        }
    };
}]);