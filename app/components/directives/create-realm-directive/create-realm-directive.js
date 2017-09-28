angular.module('ShiftOnTapApp')
.directive('createRealmDirective', ['realmService', 'userService', 'commonService', 'personaService', 'authService',
    function(realmService, userService, commonService, personaService, authService) {
    return {
        scope: {
            realmInfo: '=createRealmModel'
        },
        templateUrl: 'components/directives/create-realm-directive/create-realm.html',
        link: function (scope, element, attrs, autocompleteCtrl) {
            scope.isActiveRealm = realmService.isActiveRealm();
            scope.radioModel = 'employee';
            scope.createRealm = function() {
                var userId = userService.getLocalUser().id;
                var realm = {
                    name : scope.newRealmFormModel.name,
                    address : scope.address
                };
                realmService.createRealm(realm)
                    .then(function successCallback(response) {
                        if(response.data.access_token) {
                            authService.setToken(response.data.access_token);
                        }
                        if(response.data.token_expiration_time){
                            authService.setTokenExpirationTime(response.data.token_expiration_time);
                        }

                        var returnedRealm = response.data.realm;
                        realm.id = returnedRealm.id;
                        realmService.setLocalRealm(returnedRealm, true);
                        personaService.setLocalPersona(response.data.persona, false);
                        // There will only be one user when the realm is created, and it will be the active user that created the realm.
                        userService.setLocalUser(returnedRealm.users[0], true);

                        // Get All Realms for User
                        realmService.getRealmsByUser()
                            .then(function successCallback(response) {
                                realmService.setLocalRealms(response.data);
                                //Success
                            }, function errorCallback(response) {
                                // Failure
                                //TODO Handle this
                            });


                    }, function errorCallback(response) {
                        //TODO Handle this
                    });

            };

            scope.newRealmFormModel = {
                name : '',
                address : '',
                manager : ''
            };

            // Address populated by autofill logic
            scope.address = {};

        }

    };
}]);