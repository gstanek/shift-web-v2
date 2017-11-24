angular.module('ShiftOnTapApp')

// .factory('RealmWebSocket', ['$websocket', 'realmService', 'shiftService',
//     function($websocket, realmService, shiftService) {

.service('RealmWebSocket', ['$websocket', 'realmService', 'shiftService', 'userService',
    function($websocket, realmService, shiftService, userService) {

        var realm = realmService.getLocalRealm();
        var realmEventStream;
        if(realm) {
            realmEventStream = $websocket('ws://localhost:8000/realm/' + realm.id);
            realmEventStream.onMessage(function(message) {
                var messageData = JSON.parse(message.data);
                if("shift".localeCompare(messageData['type']) == 0) {
                    shiftService.setLocalShift(messageData['type_object'], true);
                }
                else if("user".localeCompare(messageData['type']) == 0) {
                    userService.addLocalCoworkers(new Array(messageData['type_object']), true);
                }
                else {
                    console.log("message.type not recognized");
                }
            });
        }

        this.connect = function() {
            realm = realmService.getLocalRealm();
            realmEventStream = $websocket('ws://localhost:8000/realm/' + realm.id);
            realmEventStream.onMessage(function(message) {
                var messageData = JSON.parse(message.data);
                if("shift".localeCompare(messageData['type']) == 0) {
                    shiftService.setLocalShift(messageData['type_object'], true);
                }
                else if("user".localeCompare(messageData['type']) == 0) {
                    userService.addLocalCoworkers(new Array(messageData['type_object']), true);
                }
                else {
                    console.log("message.type not recognized");
                }
            });
        }
        this.disconnect = function() {
            realmEventStream.close();
        }




        // var methods = {
        //     get: function() {
        //         dataStream.send(JSON.stringify({ action: 'get' }));
        //     }
        // };
        // return methods;
    }
]);