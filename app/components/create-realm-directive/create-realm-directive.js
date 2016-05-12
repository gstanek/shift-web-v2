angular.module('myApp.createRealmDirective', [])
//angular.module('myApp')
.directive('createRealmDirective', ['realmService', 'userService', function(realmService, userService) {
    return {
        scope: {
            realmInfo: '=createRealmModel'
        },
        templateUrl: 'components/create-realm-directive/create-realm.html',
        link: function (scope, element, attrs, autocompleteCtrl) {
            scope.isActiveRealm = realmService.isActiveRealm();
            scope.radioModel = 'employee';
            scope.createRealm = function() {
                var userId = userService.getActiveUser().id;
                var realm = {
                    name : scope.newRealmFormModel.name,
                    address : scope.address
                };
                realmService.createRealm(realm)
                    .then(function successCallback(response) {
                        realm.id = response.data.id;
                        console.log('Realm to Store in Local Storage' + JSON.stringify(realm))
                        realmService.setLocalRealm(realm);
                        //personaService.createPersona(realm.id);

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
            // Start Autofill address logic
            //scope.address = {};
            //console.log('Address in create realm: ' + JSON.stringify(scope.address));
            //console.log('Details in create realm: ' + JSON.stringify(scope.details));
            // End Autofill address logic

            // Start Autofill address logic
            scope.result = '';
            scope.options = {
                watchEnter: true,
                types:'address'
            };
            scope.address = {};
            //scope.addressFound = '';
            // End Autofill address logic

        }

    };
}]);