angular.module('myApp.createRealmDirective', [])
//angular.module('myApp')
.directive('createRealmDirective', ['realmService', 'userService', 'commonService',
    function(realmService, userService, commonService) {
    return {
        scope: {
            realmInfo: '=createRealmModel'
        },
        templateUrl: 'components/create-realm-directive/create-realm.html',
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
                        realm.id = response.data.id;
                        console.log('Realm to Store in Local Storage' + JSON.stringify(realm))
                        realmService.setLocalRealm(realm, true);
                        commonService.setPersonaDisplayState();

                    }, function errorCallback(response) {
                        console.log('Error creating realm in backend')
                    });

            };
            // Employee/Manager/Owner Picker Logic
            scope.$watchCollection('checkModel', function () {
                scope.checkResults = [];
                angular.forEach(scope.checkModel, function (value, key) {
                    if (value) {
                        scope.checkResults.push(key);
                    }
                });
            });
            // End Picker logic
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