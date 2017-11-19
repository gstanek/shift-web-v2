angular.module('ShiftOnTapApp')
.directive('addUsersDirective', ['userService', 'realmService', 'shiftService', 'Notification',
    function(userService, realmService, shiftService, Notification) {
    return {
        restrict: 'E',
        scope: {
            'ok': '&onOk',
            'cancel': '&onCancel'
        },
        templateUrl: 'components/directives/add-users/add-users.html',
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

            scope.userAttributes = [{
                "Name": "firstName",
                "Required": true
            }, {
                "Name": "lastName",
                "Required": true
            }, {
                "Name": "email",
                "Required": true
            }];

            scope.companyName = realmService.getRealmName();
            scope.formData = {
                users : [{}],
                index : 0
            };
            scope.addAnother = function() {
                scope.formData.users.push({});

            }
            scope.removeIndex = function(index) {
                console.log('index=' + index);
                if (index > -1) {
                    scope.formData.users.splice(index, 1);
                }
            }

            scope.addUsers = function(form) {
                console.log('scope.formData=' + JSON.stringify(scope.formData))
                if(form.$valid) {
                    var realm = realmService.getLocalRealm();
                    var realm_id = realm.id;
                    var usersDAO = {
                        realm_id : realm_id,
                        users : scope.formData.users //cleanedUsers
                    };
                    userService.createUsers(usersDAO)
                        .then(function successCallback(response) {
                            Notification.success('Co-workers Invited');
                            scope.ok();
                        }, function errorCallback(response) {
                            scope.errorObj = {
                                detail: response.error.message
                            };
                        });
                }
                else {
                    form.$setSubmitted();
                    scope.errorObj = {
                        detail:'Please correct errors indicated above and resubmit'
                    };
                }

            };
        }
    };
}]);