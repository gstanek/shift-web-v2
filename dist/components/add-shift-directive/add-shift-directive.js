angular.module("myApp.addShiftDirective",[]).directive("addShiftDirective",["realmService","userService","shiftService",function(a,b,c){return{restrict:"E",scope:{modal:"=",save:"&onSave",cancel:"&onCancel"},templateUrl:"components/add-shift-directive/add-shift.html",link:function(d,e,f,g){d.isActiveRealm=a.isActiveRealm();var h=function(){var a=b.getLocalUser();if(a){var d=c.getLocalShifts();return d?!0:!1}return!1};d.isShiftPresent=function(){return h()},d.companyName=a.getRealmName(),d.newShiftModel={id:"",dateRangeStart:"",dateRangeEnd:"",comment:""},d.createShift=function(){var a={startDate:d.shiftDetails.startDate,startTime:d.shiftDetails.startTime,endDate:d.shiftDetails.endDate,endTime:d.shiftDetails.endTime,comment:d.newShiftModel.comment};c.storeShift(a).then(function(a){console.log("Success:"+JSON.stringify(a)),c.setLocalShift(a.data,!0),d.save()},function(a){console.log("Failure:"+JSON.stringify(a))})},d.format="shortDate",d.popup1={opened:!1},d.popup2={opened:!1},d.shiftDetails={startDate:null,startTime:new Date,endDate:null,endTime:new Date,comment:""};var i=new Date;i.setFullYear(i.getFullYear()+5),d.startDateOptions={formatYear:"yy",maxDate:i,minDate:new Date,startingDay:0},d.endDateOptions={formatYear:"yy",maxDate:i,minDate:new Date,startingDay:0},d.today=function(){return new Date},d.startDateToday=function(){d.shiftDetails.startDate=d.today()},d.startDateToday(),d.endDateToday=function(){d.shiftDetails.endDate=d.today()},d.endDateToday(),d.startDateClear=function(){d.shiftDetails.startDate=null},d.endDateClear=function(){d.shiftDetails.endDate=null},d.open1=function(){d.popup1.opened=!0},d.open2=function(){d.popup2.opened=!0},d.$watch("shiftDetails.startDate",function(a){d.endDateOptions.minDate=d.shiftDetails.startDate,d.shiftDetails.endDate<d.shiftDetails.startDate&&(d.shiftDetails.endDate=d.shiftDetails.startDate)}),d.showEndDateEntry=!1,d.startDateHeader="Shift Date",d.endDateHeader="Shift End Date",d.toggleShowEndDate=function(){d.showEndDateEntry=!d.showEndDateEntry,d.showEndDateEntry?d.startDateHeader="Shift Start Date":d.startDateHeader="Shift Date"},d.startTimeHeader="Shift Start Time",d.endTimeHeader="Shift End Time"}}}]);