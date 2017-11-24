'use strict';

describe('ShiftOnTapApp module', function() {
  // Load the module that contains the service
  beforeEach(module('ShiftOnTapApp'));

  describe('userService', function(){
	var user, rootScope, userService, commonService, httpBackend, localStorageService;
	var store = {};

	beforeEach(inject(function (_$rootScope_, _userService_, _commonService_, $httpBackend, _localStorageService_) {
        rootScope = _$rootScope_;
        userService = _userService_;
        commonService = _commonService_;
        httpBackend = $httpBackend;
        localStorageService = _localStorageService_;

        spyOn(commonService, 'setPersonaDisplayState').and.callFake(function() {
        });

        // LocalStorage mock.
        spyOn(localStorageService, 'get').and.callFake(function(key) {
            return store[key];
        });
        spyOn(localStorageService, 'set').and.callFake(function(key, value) {
            store[key] = value;
        });
        spyOn(localStorageService, 'remove').and.callFake(function(key) {
            delete store[key];
        });

        store = {};

        spyOn(rootScope, '$broadcast');

        user = {
            "id": '123',
            "first_name": "Gabriel",
		    "last_name": "Stanek",
		    "preferred_name": "Gabe A",
		    "email": "115@gmail.com",
		    "is_active": true,
		    "is_admin": false,
		    "realms": [130]
	    };

	}));

	afterEach(function() {
	  httpBackend.verifyNoOutstandingExpectation();
	  httpBackend.verifyNoOutstandingRequest();
	});

	describe('updateUser', function() {
	  it('should return updated user', function () {

		httpBackend.whenRoute('PATCH', 'http://127.0.0.1:8000/api/v1/user/:id')//'/api/v1/user/:id')
			.respond(function(method, url, data, headers, params) {
			  return [200, {"id":params.id,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
			});

		userService.updateUser(user).then(function (returnedUser) {
		  expect(returnedUser).toEqual(user);
		});
		httpBackend.flush();
	  });

	  it('should return error response object', function () {

		httpBackend.whenRoute('PATCH', 'http://127.0.0.1:8000/api/v1/user/:id')
			.respond(function(method, url, data, headers, params) {
			  return [503, { code : 5030, detail : 'Oh no! Something went wrong, please try again'}];
			});

		userService.updateUser(user)
		  .then(function successCallback(response) {

		  }).catch(function errorCallback(response) {
			expect(response.httpStatusCode).toEqual(503);
			expect(response.error.code).toEqual(5030);
			expect(response.error.message).toEqual('Oh no! Something went wrong, please try again');
		  });

		httpBackend.flush();
	  });

	});


	describe('createUsers', function() {
	  it('should return user', function () {

		httpBackend.whenRoute('POST', 'http://127.0.0.1:8000/api/v1/user/bulk')
			.respond(function(method, url, data, headers, params) {
			  return [200, [{"id":"123","first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}]];
			});

            //{"realm_id":170,"users":[{"$$hashKey":"object:114","first_name":"Gabriel","last_name":"Stanek","email":"gabe.stanek@gmail.com"}]}
		    var userArray = [user];
		    var userPayload = {
		        "realm_id": 1234,
                "users": userArray
            }

		userService.createUsers(userPayload).then(function (returnedUser) {
		  expect(returnedUser[0].id).toEqual(user.id);
		});
        httpBackend.flush();
	  });

	  it('should return error response object', function () {

		httpBackend.whenRoute('POST', 'http://127.0.0.1:8000/api/v1/user/bulk')
			.respond(function(method, url, data, headers, params) {
			  return [503, { code : 5030, detail : 'Oh no! Something went wrong, please try again'}];
			});

        var userArray = [user,];
        var userPayload = {
              "realm_id": 1234,
              "users": userArray
        }
        userService.createUsers(userPayload)
			.then(function successCallback(response) {

			}).catch(function errorCallback(response) {
		  expect(response.httpStatusCode).toEqual(503);
		  expect(response.error.code).toEqual(5030);
		  expect(response.error.message).toEqual('Oh no! Something went wrong, please try again');
		});

            httpBackend.flush();
	  });

	});


	describe('verifyInvite', function() {
	  it('should return verified invite resource', function () {

		httpBackend.whenRoute('GET', 'http://127.0.0.1:8000/api/v1/user/invite/email/:email/code/:code')
			.respond(function(method, url, data, headers, params) {
			  return [200, {"type":"SHIFTONTAP_INVITE","user":280,"realm":{"id":130,"name":"115 Biz","users":[{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":params.email,"is_active":true,"is_admin":false,"realms":[130]},{"id":165,"first_name":"T","last_name":"Dog","preferred_name":"","email":"tdog@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":166,"first_name":"F2","last_name":"L2","preferred_name":"","email":"fl2@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":167,"first_name":"F3","last_name":"L3","preferred_name":"","email":"fl3@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":168,"first_name":"F4","last_name":"L4","preferred_name":"","email":"fl4@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":169,"first_name":"F5","last_name":"L5","preferred_name":"","email":"fl5@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":170,"first_name":"F7","last_name":"L7","preferred_name":"","email":"fl7@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":171,"first_name":"F8","last_name":"L8","preferred_name":"","email":"fl8@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":172,"first_name":"F9","last_name":"L9","preferred_name":"","email":"fl9@gmail.com","is_active":true,"is_admin":false,"realms":[130]},{"id":280,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"","email":"gabe.stanek@gmail.com","is_active":false,"is_admin":false,"realms":[130]}],"address":{"address_line_one":"1150 University Ave","address_line_two":null,"city":"Madison","subnational_region":"WI","postal_code":"53706"}}}];
			});

		userService.verifyInvitee('gabe.stanek@gmail.com', '123456').then(function (response) {
		  expect(response.type).toEqual("SHIFTONTAP_INVITE");
		});
		httpBackend.flush();
	  });

	  it('should return error response object', function () {

		httpBackend.whenRoute('GET', 'http://127.0.0.1:8000/api/v1/user/invite/email/:email/code/:code')
			.respond(function(method, url, data, headers, params) {
			  return [503, { code : 5030, detail : 'Oh no! Something went wrong, please try again'}];
			});

		userService.verifyInvitee('gabe.stanek@gmail.com', '123456')
			.then(function successCallback(response) {

			}).catch(function errorCallback(response) {
		  expect(response.httpStatusCode).toEqual(503);
		  expect(response.error.code).toEqual(5030);
		  expect(response.error.message).toEqual('Oh no! Something went wrong, please try again');
		});

		httpBackend.flush();
	  });

	});

	describe('getBestDisplayName', function() {
	  it('should return first name', function () {
		var userWithoutPreferredName = {
		  "id": '123',
		  "first_name": "Gabriel",
		  "last_name": "Stanek",
		  "preferred_name": "",
		  "email": "115@gmail.com",
		  "is_active": true,
		  "is_admin": false,
		  "realms": [130]
		};
		localStorageService.set('user', userWithoutPreferredName);

		var displayName = userService.getBestDisplayName();
		  expect(displayName).toEqual("Gabriel");
	  });

	  it('should return first name', function () {
		var userWithPreferredName = {
		  "id": '123',
		  "first_name": "Gabriel",
		  "last_name": "Stanek",
		  "preferred_name": "G Swazy",
		  "email": "115@gmail.com",
		  "is_active": true,
		  "is_admin": false,
		  "realms": [130]
		};
		localStorageService.set('user', userWithPreferredName);

		var displayName = userService.getBestDisplayName();
		expect(displayName).toEqual("G Swazy");
	  });

	  it('should return first name', function () {
		var userWithNoName = {
		  "id": '123',
		  "first_name": "",
		  "last_name": "Stanek",
		  "preferred_name": "",
		  "email": "115@gmail.com",
		  "is_active": true,
		  "is_admin": false,
		  "realms": [130]
		};
		localStorageService.set('user', userWithNoName);

		var displayName = userService.getBestDisplayName();
		expect(displayName).toEqual("115@gmail.com");
	  });



	});

    describe('addLocalCoworkers', function() {
        it('should save a passed in array that contains a coworker', function () {
            var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, false);

            expect(localStorageService.get('coworkers')[0].id).toEqual(164);
            expect(localStorageService.get('coworkers').length).toEqual(1);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', coworkerArray);
        });

        it('should save a passed in array that contains multiple coworkers when none exist', function () {
            var coworkerArray = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, false);

            expect(localStorageService.get('coworkers')[0].id).toEqual(163);
            expect(localStorageService.get('coworkers').length).toEqual(3);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', coworkerArray);
        });

        it('should reorder and save a passed in array that contains multiple coworkers when none exist', function () {
            var coworkerArray = [{"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            var expectedCoWorkerArray = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];


            userService.addLocalCoworkers(coworkerArray, false);

            expect(localStorageService.get('coworkers')[0].id).toEqual(163);
            expect(localStorageService.get('coworkers').length).toEqual(3);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', expectedCoWorkerArray);
        });

        it('should save a passed in array that contains multiple coworkers to an existing set', function () {
            var firstCoworker = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
            localStorageService.set('coworkers', firstCoworker);

            var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            var expectedCoWorkerArray = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, false);

            expect(localStorageService.get('coworkers').length).toEqual(3);
            expect(localStorageService.get('coworkers')[1].id).toEqual(164);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', expectedCoWorkerArray);
        });

        it('should save a passed in array that contains one coworker to an existing set as one instance when called multiple times', function () {
            var firstCoworker = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
            localStorageService.set('coworkers', firstCoworker);

            var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            var expectedCoWorkerArray = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                {"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, false);
            userService.addLocalCoworkers(coworkerArray, false);
            userService.addLocalCoworkers(coworkerArray, false);

            expect(localStorageService.get('coworkers').length).toEqual(2);
            expect(localStorageService.get('coworkers')[1].id).toEqual(164);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', expectedCoWorkerArray);
        });

        it('should call setPersonaDisplayState', function () {
            var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, true);

            expect(commonService.setPersonaDisplayState).toHaveBeenCalled();
        });

        it('should NOT call setPersonaDisplayState', function () {
            var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

            userService.addLocalCoworkers(coworkerArray, false);

            expect(commonService.setPersonaDisplayState).not.toHaveBeenCalled();
        });
    });

      describe('setLocalCoworkers', function() {
          it('should save a passed in array that contains a coworker', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

              userService.setLocalCoworkers(coworkerArray, false);

              expect(localStorageService.get('coworkers')[0].id).toEqual(164);
              expect(localStorageService.get('coworkers').length).toEqual(1);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', coworkerArray);
          });

          it('should save a passed in array that contains multiple coworkers and overwrite an existing set', function () {
              var firstCoworker = [{"id":163,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
              localStorageService.set('coworkers', firstCoworker);

              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                  {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

              var expectedCoWorkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                  {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

              userService.setLocalCoworkers(coworkerArray, false);

              expect(localStorageService.get('coworkers')[1].id).toEqual(165);
              expect(localStorageService.get('coworkers').length).toEqual(2);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('COWORKER_CHANGE_EVENT', expectedCoWorkerArray);
          });

          it('should call setPersonaDisplayState', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

              userService.setLocalCoworkers(coworkerArray, true);

              expect(commonService.setPersonaDisplayState).toHaveBeenCalled();
          });

          it('should NOT call setPersonaDisplayState', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];

              userService.setLocalCoworkers(coworkerArray, false);

              expect(commonService.setPersonaDisplayState).not.toHaveBeenCalled();
          });
      });

      describe('getLocalCoworkers', function() {
          it('should get a saved array that contains a coworker', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
              localStorageService.set('coworkers', coworkerArray);

              var returnedCoworkers = userService.getLocalCoworkers();

              expect(returnedCoworkers[0].id).toEqual(164);
              expect(returnedCoworkers.length).toEqual(1);

          });

          it('should get a saved array that contains coworkers', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]},
                  {"id":165,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
              localStorageService.set('coworkers', coworkerArray);

              var returnedCoworkers = userService.getLocalCoworkers();

              expect(returnedCoworkers[1].id).toEqual(165);
              expect(returnedCoworkers.length).toEqual(2);

          });
      });

      describe('removeLocalCoworkers', function() {
          it('should remove coworkers entry', function () {
              var coworkerArray = [{"id":164,"first_name":"Gabriel","last_name":"Stanek","preferred_name":"Gabe A","email":"115@gmail.com","is_active":true,"is_admin":false,"realms":[130]}];
              localStorageService.set('coworkers', coworkerArray);

              userService.removeLocalCoworkers();

              expect(localStorageService.get('coworkers')).toEqual(undefined);
          });
      });

      describe('setLocalUser', function() {
          it('should save a passed in user', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };

              var broadcastObj = {
                  type: 'UPDATE',
                  value: user
              };

              userService.setLocalUser(user, false);

              expect(localStorageService.get('user').id).toEqual(164);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('USER_CHANGE_EVENT', broadcastObj);
          });

          it('should overwrite existing user', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };
              localStorageService.set('user', user);
              var user2 = {
                  "id": 165,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };
              var broadcastObj = {
                  type: 'UPDATE',
                  value: user2
              };

              userService.setLocalUser(user2, false);

              expect(localStorageService.get('user').id).toEqual(165);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('USER_CHANGE_EVENT', broadcastObj);
          });

          it('should call setPersonaDisplayState', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };

              userService.setLocalUser(user, true);

              expect(commonService.setPersonaDisplayState).toHaveBeenCalled();
          });
          it('should NOT call setPersonaDisplayState', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };

              userService.setLocalUser(user, false);

              expect(commonService.setPersonaDisplayState).not.toHaveBeenCalled();
          });
      });

      describe('getLocalUser', function() {
          it('should get a saved user', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };
              localStorageService.set('user', user);

              var returnedUser = userService.getLocalUser();

              expect(returnedUser.id).toEqual(164);
          });

          it('should return undefined for when no user is active', function () {
              var returnedUser = userService.getLocalCoworkers();

              expect(returnedUser).toEqual(undefined);
          });
      });

      describe('removeLocalUser', function() {
          it('should remove user from local storage', function () {
              var broadcastObj = {
                  type: 'DELETE',
                  value: undefined
              };

              userService.removeLocalUser(false);

              expect(localStorageService.get('user')).toEqual(undefined);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('USER_CHANGE_EVENT', broadcastObj);
          });

          it('should overwrite existing user', function () {
              var user = {
                  "id": 164,
                  "first_name": "Gabriel",
                  "last_name": "Stanek",
                  "preferred_name": "Gabe A",
                  "email": "115@gmail.com",
                  "is_active": true,
                  "is_admin": false,
                  "realms": [130]
              };
              localStorageService.set('user', user);
              var broadcastObj = {
                  type: 'DELETE',
                  value: undefined
              };

              userService.removeLocalUser(false);

              expect(localStorageService.get('user')).toEqual(undefined);
              expect(rootScope.$broadcast).toHaveBeenCalledWith('USER_CHANGE_EVENT', broadcastObj);
          });

          it('should NOT invoke setPersonaDisplayState', function () {
              userService.removeLocalUser(false);

              expect(commonService.setPersonaDisplayState).not.toHaveBeenCalled();
          });

          it('should invoke setPersonaDisplayState', function () {
              userService.removeLocalUser(true);

              expect(commonService.setPersonaDisplayState).toHaveBeenCalled();
          });
      });

  });
});