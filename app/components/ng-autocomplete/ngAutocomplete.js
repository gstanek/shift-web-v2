'use strict';

/**
 * A directive for adding google places autocomplete to a text box
 * google places autocomplete info: https://developers.google.com/maps/documentation/javascript/places
 *
 * Usage:
 *
 * <input type="text"  ng-autocomplete ng-model="autocomplete" options="options" details="details/>
 *
 * + ng-model - autocomplete textbox value
 *
 * + details - more detailed autocomplete result, includes address parts, latlng, etc. (Optional)
 *
 * + options - configuration for the autocomplete (Optional)
 *
 *       + types: type,        String, values can be 'geocode', 'establishment', '(regions)', or '(cities)'
 *       + bounds: bounds,     Google maps LatLngBounds Object, biases results to bounds, but may return results outside these bounds
 *       + country: country    String, ISO 3166-1 Alpha-2 compatible country code. examples; 'ca', 'us', 'gb'
 *
 * example:
 *
 *    options = {
 *        types: '(cities)',
 *        country: 'ca'
 *    }
 **/

angular.module( "myApp.ngAutocomplete", [])
    .directive('ngAutocomplete', function() {
      return {
        require: 'ngModel',
        scope: {
          ngModel: '=',
          details: '=?',
          address: '='
        },

        link: function(scope, element, attrs, controller) {
          if (scope.gPlace == undefined) {
            scope.gPlace = new google.maps.places.Autocomplete(element[0], {});
            scope.gPlace.setTypes(['address'])
            scope.gPlace.setBounds(null)
            scope.gPlace.setComponentRestrictions(null)
          }
          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            var result = scope.gPlace.getPlace();
            if (result !== undefined) {
              if (result.address_components !== undefined) {

                scope.$apply(function() {

                  scope.details = result;
                  if(scope.details) {
                    if(scope.details.address_components) {
                      for (var i = 0; i < scope.details.address_components.length; i++) {
                        if(scope.details.address_components[i].types) {
                          for (var j = 0; j < scope.details.address_components[i].types.length; j++) {
                            if(scope.details.address_components[i].types[j] == 'street_number'){
                              scope.address.number = scope.details.address_components[i].short_name;
                            }
                            if(scope.details.address_components[i].types[j] == 'route'){
                              scope.address.route = scope.details.address_components[i].short_name;
                            }
                            if(scope.details.address_components[i].types[j] == 'locality'){
                              scope.address.city = scope.details.address_components[i].long_name;
                            }
                            if(scope.details.address_components[i].types[j] == 'administrative_area_level_1'){
                              scope.address.subnational_region = scope.details.address_components[i].short_name;
                            }
                            if(scope.details.address_components[i].types[j] == 'postal_code'){
                              scope.address.postal_code = scope.details.address_components[i].short_name;
                            }
                          }
                        }
                      }
                    }
                    if(scope.address.number && scope.address.route) {
                      scope.address.address_line_one = scope.address.number + ' ' + scope.address.route;
                    }
                    else if (scope.address.route) {
                      scope.address.address_line_one = scope.address.route;
                    }
                    else if (scope.address.number) {
                      scope.address.address_line_one = scope.address.number;
                    }
                  }

                  controller.$setViewValue(element.val());
                });
              }
              else {
                // On Enter select top autocomplete result
                getPlace(result)
              }
            }
          })

          //function to get retrieve the autocompletes first result using the AutocompleteService
          var getPlace = function(result) {
            var autocompleteService = new google.maps.places.AutocompleteService();
            if (result.name.length > 0){
              autocompleteService.getPlacePredictions(
                  {
                    input: result.name,
                    offset: result.name.length
                  },
                  function listentoresult(list, status) {
                    if(list == null || list.length == 0) {

                      scope.$apply(function() {
                        scope.details = null;
                      });

                    } else {
                      var placesService = new google.maps.places.PlacesService(element[0]);
                      placesService.getDetails(
                          {'reference': list[0].reference},
                          function detailsresult(detailsResult, placesServiceStatus) {

                            if (placesServiceStatus == google.maps.GeocoderStatus.OK) {
                              scope.$apply(function() {

                                controller.$setViewValue(detailsResult.formatted_address);
                                element.val(detailsResult.formatted_address);

                                scope.details = detailsResult;

                                //on focusout the value reverts, need to set it again.
                                var watchFocusOut = element.on('focusout', function(event) {
                                  element.val(detailsResult.formatted_address);
                                  element.unbind('focusout')
                                })

                              });
                            }
                          }
                      );
                    }
                  });
            }
          }

          controller.$render = function () {
            var location = controller.$viewValue;
            element.val(location);
          };
        }
      };
    });