"use strict";angular.module("myApp.ngAutocomplete",[]).directive("ngAutocomplete",function(){return{require:"ngModel",scope:{ngModel:"=",address:"="},link:function(a,b,c,d){void 0==a.gPlace&&(a.gPlace=new google.maps.places.Autocomplete(b[0],{}),a.gPlace.setTypes(["address"]),a.gPlace.setBounds(null),a.gPlace.setComponentRestrictions(null)),google.maps.event.addListener(a.gPlace,"place_changed",function(){var c=a.gPlace.getPlace();void 0!==c&&(void 0!==c.address_components?a.$apply(function(){if(a.details=c,a.details){if(a.details.address_components)for(var e=0;e<a.details.address_components.length;e++)if(a.details.address_components[e].types)for(var f=0;f<a.details.address_components[e].types.length;f++)"street_number"==a.details.address_components[e].types[f]&&(a.address.number=a.details.address_components[e].short_name),"route"==a.details.address_components[e].types[f]&&(a.address.route=a.details.address_components[e].short_name),"locality"==a.details.address_components[e].types[f]&&(a.address.city=a.details.address_components[e].long_name),"administrative_area_level_1"==a.details.address_components[e].types[f]&&(a.address.subnational_region=a.details.address_components[e].short_name),"postal_code"==a.details.address_components[e].types[f]&&(a.address.postal_code=a.details.address_components[e].short_name);a.address.number&&a.address.route?a.address.address_line_one=a.address.number+" "+a.address.route:a.address.route?a.address.address_line_one=a.address.route:a.address.number&&(a.address.address_line_one=a.address.number)}d.$setViewValue(b.val())}):e(c))});var e=function(c){var e=new google.maps.places.AutocompleteService;c.name.length>0&&e.getPlacePredictions({input:c.name,offset:c.name.length},function(c,e){if(null==c||0==c.length)a.$apply(function(){a.details=null});else{var f=new google.maps.places.PlacesService(b[0]);f.getDetails({reference:c[0].reference},function(c,e){e==google.maps.GeocoderStatus.OK&&a.$apply(function(){d.$setViewValue(c.formatted_address),b.val(c.formatted_address),a.details=c;b.on("focusout",function(a){b.val(c.formatted_address),b.unbind("focusout")})})})}})};d.$render=function(){var a=d.$viewValue;b.val(a)}}}});