angular.module("myApp.addShiftDirective",[]).directive("addShiftDirective",["realmService","userService","shiftService","commonService",function(a,b,c,d){"ngInject";return{restrict:"E",scope:{modal:"=",save:"&onSave",cancel:"&onCancel"},templateUrl:"components/add-shift-directive/add-shift.html",link:function(e,f,g,h){e.isActiveRealm=a.isActiveRealm();var i=function(){var a=b.getLocalUser();if(a){var d=c.getLocalShifts();return d?!0:!1}return!1};e.isShiftPresent=function(){return i()},e.companyName=a.getRealmName(),e.newShiftModel={id:"",dateRangeStart:"",dateRangeEnd:"",comment:""},e.createShift=function(){var a={startDate:e.shiftDetails.startDate,startTime:e.shiftDetails.startTime,endDate:e.shiftDetails.endDate,endTime:e.shiftDetails.endTime,comment:e.newShiftModel.comment};c.storeShift(a).then(function(a){console.log("Success:"+JSON.stringify(a)),c.setLocalShift(a.data,!0),e.save()},function(a){console.log("Failure:"+JSON.stringify(a))})},e.format="shortDate",e.popup1={opened:!1},e.popup2={opened:!1},e.shiftDetails={startDate:null,startTime:d.roundMinutes(new Date),endDate:null,endTime:d.roundMinutes(new Date),comment:""};var j=new Date;j.setFullYear(j.getFullYear()+5),e.startDateOptions={formatYear:"yy",maxDate:j,minDate:new Date,startingDay:0},e.endDateOptions={formatYear:"yy",maxDate:j,minDate:new Date,startingDay:0},e.today=function(){return new Date},e.startDateToday=function(){e.shiftDetails.startDate=e.today()},e.startDateToday(),e.endDateToday=function(){e.shiftDetails.endDate=e.today()},e.endDateToday(),e.startDateClear=function(){e.shiftDetails.startDate=null},e.endDateClear=function(){e.shiftDetails.endDate=null},e.open1=function(){e.popup1.opened=!0},e.open2=function(){e.popup2.opened=!0},e.$watch("shiftDetails.startDate",function(a){e.endDateOptions.minDate=e.shiftDetails.startDate,e.shiftDetails.endDate<e.shiftDetails.startDate&&(e.shiftDetails.endDate=e.shiftDetails.startDate)}),e.showEndDateEntry=!1,e.startDateHeader="Shift Date",e.endDateHeader="Shift End Date",e.toggleShowEndDate=function(){e.showEndDateEntry=!e.showEndDateEntry,e.showEndDateEntry?e.startDateHeader="Shift Start Date":e.startDateHeader="Shift Date"},e.startTimeHeader="Shift Start Time",e.endTimeHeader="Shift End Time"}}}]);