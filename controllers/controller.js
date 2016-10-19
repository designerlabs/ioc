var myApp = angular.module('myApp',[]);
localStorage.clear();


myApp.factory('httpInterceptor', ['$q', '$rootScope',
        function ($q, $rootScope) {
            var loadingCount = 0;

            return {
                request: function (config) {
                    if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                    return config || $q.when(config);
                },

                response: function (response) {
                    if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                    return response || $q.when(response);
                },

                responseError: function (response) {
                    if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                    return $q.reject(response);
                }
            };
        }
    ]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);


// myApp.factory('httpRequestInterceptor', function () {
//   return {
//     request: function (config) {

//       config.headers['Authorization'] = 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==';
//       config.headers['Accept'] = 'application/json;odata=verbose';

//       return config;
//     }
//   };
// });

// myApp.config(function ($httpProvider) {
//   $httpProvider.interceptors.push('httpRequestInterceptor');
//    $httpProvider.defaults.headers.common = {};
//   $httpProvider.defaults.headers.post = {};
//   $httpProvider.defaults.headers.put = {};
//   $httpProvider.defaults.headers.patch = {};
// });

myApp.controller('AppCtrl', ['$scope', '$http', '$timeout', '$rootScope', function($scope, $http, $timeout, $rootScope){
    $scope.maintitle = "IOC";
    $scope.subtitle = "Information Dissemination Dashboard";
    

    $scope.dateReset = function(){
        $('#datetimepicker1, #datetimepicker2').datetimepicker({
            defaultDate:'now',
            format: 'DD/MM/YYYY'
        });
    }
     $(function () {
        $scope.dateReset();
    });


        $http.get("http://10.1.70.84:8080/mobilegateway/masterdata/states")
        .then(function(response) {
            $scope.getStateInfo = response.data.statesList;
        });

        $scope.$watch('getState', function (newValue, oldValue) {
            //debugger;
        });

        $scope.getDistrict = function(num){
            $http({
                url:'http://10.1.70.84:8080/mobilegateway/masterdata/states/',
                method:"POST",
                data: {
                    "stateid" : num
                },
                 //headers: {'Content-Type': 'application/json;charset=UTF-8'}
                 
                 headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                 } 
               
            }).success(function (data, status, headers) {
                //debugger;
                $scope.getDistrictInfo = data.citiesList;
            })
            .error(function (data, status, header) {
                //debugger;
            });
        };


        $scope.getImpactArea = function(state, city){
            console.log(state, city);
            $http({
                url:' http://10.1.70.84:8080/mobilegateway/masterdata/impactedareas/',
                method:"POST",
                data: {
                    "cityId":city,
                    "stateId":state
                },
                 //headers: {'Content-Type': 'application/json;charset=UTF-8'}
                 
                 headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                 } 
               
            }).success(function (data, status, headers) {
                $scope.getImpact = data.wkt[0];
                console.log($scope.getImpact);
                $scope.impactedAreaVal = $scope.getImpact;
            })
            .error(function (data, status, header) {
            });
        }


    
        $rootScope.$on('loading:progress', function (){
            console.log("loading");
            $scope.loading = true;
        });

        $rootScope.$on('loading:finish', function (){
            $scope.loading = false;
            console.log("stop");
        });

    $("#datetimepicker1").on("dp.change", function() {
        $scope.selecteddate = $("#datetimepicker1").val();
    });

    $("#datetimepicker2").on("dp.change", function() {
        $scope.selectedestimateddate = $("#datetimepicker2").val();
    });

    $scope.channelAdd = true;
    $scope.channelEdit = false;
    $scope.addbtn = true;
    $scope.updatebtn = false;
    $scope.newbtn = false;
    
    $scope.formArray = [];
    
    $scope.formData = {};
    $scope.headerData = {};


    $scope.showsubmitbtn = false;

    $scope.submit = function() {
        $scope.idSelectedRow = null;
        $scope.headerArray = [];
        $scope.formData.date = $scope.selecteddate;
        $scope.formData.edate = $scope.selectedestimateddate;
        console.log($scope.formArray);
        $scope.formDatas = {};
        $scope.headerDatas = {};
        
        $scope.formDatas.currentIndex = $scope.formArray.length;
        $scope.formDatas.msgtype = $scope.formData.msgtype;
        $scope.formDatas.notifytype = $scope.formData.notifytype;
        $scope.formDatas.eventId = $scope.formData.eventId;
        $scope.formDatas.messageId = $scope.formData.messageId;
        $scope.formDatas.date = $scope.selecteddate;
        $scope.formDatas.edate = $scope.selectedestimateddate;
        $scope.formDatas.state = $scope.getState;
        $scope.formDatas.district = $scope.getDistric;
        $scope.formDatas.targetchannel = $scope.formData.targetchannel;
        $scope.formDatas.targetusrgrp = $scope.formData.targetusrgrp;
        //$scope.formDatas.certaintylevel = $scope.formData.certaintylevel;
        //$scope.formDatas.severitylevel = $scope.formData.severitylevel;
        $scope.formDatas.messageformat = $scope.formData.messageformat;
        $scope.formDatas.messagetemplate = $scope.formData.messagetemplate;
        //$scope.formDatas.locationInfoType = $scope.formData.locationInfoType;
        $scope.formDatas.txtcomment = $scope.formData.txtcomment;
        $scope.formArray.push($scope.formDatas);
        localStorage.setItem('formData', JSON.stringify($scope.formArray));
        
        $scope.getFormData = JSON.parse(localStorage.getItem('formData'));

        if($scope.getFormData.length > 0){
            $scope.showsubmitbtn = true;
        }else{
            $scope.showsubmitbtn = false;
        }
        //headerData

        $scope.headerDatas.messageId = $scope.formData.messageId;;
        $scope.headerDatas.eventId = $scope.formData.eventId;
        $scope.headerDatas.messageId = $scope.formData.messageId;
        $scope.headerDatas.messageDate = moment().format('DD-MM-YYYY HH:mm:ss');
        $scope.headerDatas.messageType = $scope.formData.msgtype;
        $scope.headerDatas.notificationType = $scope.formData.notifytype;
        $scope.headerDatas.locationType = $scope.formData.locationInfoType;
        $scope.headerDatas.severitylevel = $scope.formData.severitylevel;
        $scope.headerDatas.certainityLevel = $scope.formData.certaintylevel;
        $scope.headerDatas.impactedArea = $scope.impactedAreaVal;
        $scope.headerDatas.targetDate = $scope.formData.date;
        $scope.headerDatas.estimatedStartDate = $scope.formData.edate;
        $scope.headerDatas.originator = $scope.formData.originator;
        $scope.headerDatas.userId = "10021";

        $scope.headerArray.push($scope.headerDatas);
        localStorage.setItem('headerData', JSON.stringify($scope.headerArray));
        $scope.getHeaderData = JSON.parse(localStorage.getItem('headerData'));

        $("#targetchannel").val("");
        $scope.hideFields();
        
        $("#channelFormSection select, #channelFormSection input, #channelFormSection textarea").val("")
        $(".successMsg").show().delay(2000).fadeOut();
        $scope.message = "Record successfully inserted";
        $("#channelFormSection").hide();
    };
    $scope.idSelectedRow = null;
    $scope.action = {
        edit: function(idSelectedRow, e){
            $scope.changeArray = [];
            $scope.changeStatus = false;
            $scope.channelAdd = false;
            $scope.channelEdit = true;
            $scope.addbtn = false;
            $scope.updatebtn = true;
            $scope.newbtn = true;
            $scope.idSelectedRow = idSelectedRow;
            $scope.getSelectedRow = $scope.getFormData[e];
            $scope.showFields();
            $("#channelFormSection").show();

            targetchannel.value = $scope.getSelectedRow.targetchannel.id;
            $("#datetimepicker1").val($scope.getSelectedRow.date);
            $("#datetimepicker2").val($scope.getSelectedRow.edate);
            $scope.selectedChannel = $scope.getSelectedRow.targetchannel.type;
            targetusrgrp.value = $scope.getSelectedRow.targetusrgrp.id
            //locationInfoType.value = $scope.getSelectedRow.locationInfoType.id;
            //severitylevel.value = $scope.getSelectedRow.severitylevel.id;
            //certaintylevel.value = $scope.getSelectedRow.certaintylevel.id;
            messageformat.value = $scope.getSelectedRow.messageformat.id;
            messagetemplate.value = $scope.getSelectedRow.messagetemplate.id;
            txtcomment.value = $scope.getSelectedRow.txtcomment;
            state.value = "string:"+$scope.getSelectedRow.state;
            $timeout(function () {
                $("#district").val("string:"+$scope.getSelectedRow.district);
            }, 1000);
            

        },

        update: function(e){
            console.log($scope.getFormData);
            console.log($scope.formData);
            
            $scope.cindex = $scope.getSelectedRow.currentIndex;
            console.log($scope.getFormData[$scope.cindex]);
            $scope.currIndex = $scope.formArray[$scope.cindex];
            
            $scope.currIndex.targetusrgrp = $scope.chck('targetusrgrp');
            $scope.currIndex.messageformat = $scope.chck('messageformat');
            $scope.currIndex.messagetemplate = $scope.chck('messagetemplate');
            $scope.currIndex.txtcomment = $scope.chck('txtcomment');
            $scope.currIndex.targetchannel = $scope.chck('targetchannel');
            
            
            $scope.getHeaderData[0].targetDate = $scope.selecteddate;
            $scope.getHeaderData[0].estimatedStartDate = $scope.selectedestimateddate;
            $scope.getHeaderData[0].messageDate = moment().format('DD-MM-YYYY HH:mm:ss');
            $scope.getHeaderData[0].eventId = $scope.formData.eventId;
            $scope.getHeaderData[0].messageId = $scope.formData.messageId;
            $scope.getHeaderData[0].messageType = $scope.formData.msgtype;
            $scope.getHeaderData[0].notificationType = $scope.formData.notifytype;
            $scope.getHeaderData[0].originator = $scope.formData.originator;
            $scope.getHeaderData[0].locationType = $scope.formData.locationInfoType;
            $scope.getHeaderData[0].severitylevel = $scope.formData.severitylevel;
            $scope.getHeaderData[0].certainityLevel = $scope.formData.certaintylevel;
            
            // $scope.currIndex.targetchannel = $scope.formData.targetchannel;
            
            localStorage.clear();
            
            localStorage.setItem('formData', JSON.stringify($scope.formArray));
          
            $scope.getFormData = JSON.parse(localStorage.getItem('formData'));

            $(".successMsg").show().delay(2000).fadeOut();
            $scope.message = "Record successfully Updated";
            $("#targetchannel").val("");
            $("#channelFormSection select, #channelFormSection input, #channelFormSection textarea").val("")
            $("#channelFormSection").hide();
            $scope.hideFields();
            $scope.idSelectedRow = null;
            $scope.addbtn = true;
            $scope.updatebtn = false;
            $scope.newbtn = false;
           
             //$scope.getFormData = JSON.parse(localStorage.getItem('formData'));
             
        },

        new: function(e){
            $("#targetchannel").val("");
            $("#channelFormSection select, #channelFormSection input, #channelFormSection textarea").val("")
            $("#channelFormSection").hide();
            $scope.hideFields();
            $scope.idSelectedRow = null;
            $scope.addbtn = true;
            $scope.updatebtn = false;
            $scope.newbtn = false;
        },

        reset: function(e){
            $("#targetchannel").val("");
            $("#channelFormSection select, #channelFormSection input, #channelFormSection textarea, #targetChannelSection select, #targetChannelSection input").val("")
            $("#channelFormSection").hide();
            $scope.impactedAreaVal = "";
            $scope.hideFields();
            $scope.dateReset();
            $scope.idSelectedRow = null;
            $scope.addbtn = true;
            $scope.updatebtn = false;
            $scope.newbtn = false;
        },

        predelete: function(e){
            $("#confirmationMsg").modal('show');
        },

        delete: function(e){
            $scope.formArray.splice(e, 1);
            for(a in $scope.formArray){
                $scope.formArray[a].currentIndex = parseInt(a);
            }
            localStorage.clear();

            localStorage.setItem('formData', JSON.stringify($scope.formArray));

            

            $scope.getFormData = JSON.parse(localStorage.getItem('formData'));
            
            if($scope.getFormData.length > 0){
                $scope.showsubmitbtn = true;
            }else{
                $scope.showsubmitbtn = false;
            }

            $("#confirmationMsg").modal('hide');
        },

        submit: function(e){
            var getHeaderValue = JSON.parse(localStorage.getItem("headerData"));

            channel = function(){
                var channelArrary = [];
                for(var j = 0; j < $scope.getFormData.length; j++){
                    var res = {};
                    res.channelType = $scope.getFormData[j].targetchannel.code;
                    res.targetUserGroups = $scope.getFormData[j].targetusrgrp.type;
                    res.messageFormat = $scope.getFormData[j].messageformat.code;
                    res.refTemplateId = $scope.getFormData[j].messagetemplate.type;
                    res.message = $scope.getFormData[j].txtcomment;
                  // res.severityLevel = $scope.getFormData[j].severitylevel.code;
                  // res.certainityLevel = $scope.getFormData[j].certaintylevel.code;
                  // res.locationType = $scope.getFormData[j].locationInfoType.code;
                  // res.efectedArea = "";
                  // res.targetDate = moment($scope.getFormData[j].date).format('YYYYMMDD');
                   
                    channelArrary.push(res);
                }

                return channelArrary;
            };

            convertdt = function(dt){
                var myDate = moment(dt, 'DD/MM/YYYY');
                var myFmt = moment(myDate).format("MM/DD/YYYY");
                return moment(myFmt).format('YYYYMMDD');
            };
            data = {
                "messageId": $scope.getHeaderData[0].messageId,
                "eventId":$scope.getHeaderData[0].eventId,
                "messageDate": $scope.getHeaderData[0].messageDate,
                "messageType": $scope.getHeaderData[0].messageType.code,
                "notificationType": $scope.getHeaderData[0].notificationType.code,
                "originator": $scope.getHeaderData[0].originator.type,
                "locationType":$scope.getHeaderData[0].locationType.code,
	            "severityLevel":$scope.getHeaderData[0].severitylevel.code,
	            "certainityLevel":$scope.getHeaderData[0].certainityLevel.code,
	            "impactedArea":$scope.impactedAreaVal,
                "targetDate": convertdt($scope.getHeaderData[0].targetDate),
                //moment($scope.getHeaderData[0].targetDate).format('YYYYMMDD')
                "estimatedStartDate":convertdt($scope.getHeaderData[0].estimatedStartDate),
                //moment($scope.getHeaderData[0].estimatedStartDate).format('YYYYMMDD')
                "userId": $scope.getHeaderData[0].userId,
                "channel": channel()
            }
            
            $http({
                url:'http://10.1.70.84:8080/misos/disseminate/add',
                method:"POST",
                 data: data,
                 //headers: {'Content-Type': 'application/json;charset=UTF-8'}
                 
                 headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                 } 
               
            }).success(function (data, status, headers) {
                //debugger;
                localStorage.clear();
                $scope.formArray = [];
                $scope.getFormData = JSON.parse(localStorage.getItem('formData'));
                $(".successMsg").show().delay(2000).fadeOut();
                $scope.message = "Data successfully submitted";    
                $scope.action.reset();
            })
            .error(function (data, status, header) {
                //debugger;
            });
        }
    };

     $scope.$watch('formData.targetchannel', function (newValue, oldValue) {
         //debugger;
        $scope.channelAdd = true;
        $scope.channelEdit = false;
    });
    
    

    $scope.chck = function(output){
        var op = $scope.changeArray.indexOf(output);
        if(op != -1){
            return $scope.formData[output];
        }else{
            return $scope.getSelectedRow[output];
        }

    }
    

    $scope.changeArray = [];
     $scope.changedValue = function(item, name) {
        $scope.changeArray.push(name);
        $scope.gItem = item.type;
        $scope.changeStatus = true;
    };


    
    /* states  and district */




     /* Target Channels */
    $scope.targetChannels = [{
        id: 1,
        type: 'SMS',
        code: 'CH_01'
    }, {
        id: 2,
        type: 'Email',
        code: 'CH_02'
    }, {
        id: 3,
        type: 'Fax',
        code:'CH_03'
    }, {
        id: 4,
        type: 'Mobile App',
        code:'CH_04'
    }, {
        id: 5,
        type: 'Facebook',
        code:'CH_05'
    }, {
        id: 6,
        type: 'Twitter',
        code:'CH_06'
    }, {
        id: 7,
        type: 'Public Portal',
        code:'CH_07'
    }, {
        id: 8,
        type: '1Malaysia Map',
        code:'CH_08'
    }, {
        id: 9,
        type: 'Siren',
        code:'CH_09'
    }, {
        id: 10,
        type: 'CAP',
        code:'CH_10'
    }];



     /* Message Type */
    $scope.messageTypes = [{
        id: 1,
        type: 'warning',
        code: 'MT_1'
    }, {
        id: 2,
        type: 'Acknowledgement',
        code: 'MT_2'
    },{
        id: 3,
        type: 'Expiration and Cancellation',
        code: 'MT_3'
    },{
        id: 4,
        type: 'Update and Amendment',
        code: 'MT_4'
    }];


     /* Notification Type */
    $scope.notificationTypes = [{
        id: 1,
        type: 'Current alert',
        code: 'NT_CNT'
    }, {
        id: 2,
        type: '7 days warning',
        code: 'NT_7D'
    }, {
        id: 3,
        type: '2 days warning',
        code: 'NT_2D'
    }, {
        id: 4,
        type: 'Recall',
        code: 'NT_RC'
    }];

    /* Message format */
    $scope.messageFormat = [{
        id: 1,
        type: 'Text',
        code: 'MF_TXT'
    }, {
        id: 2,
        type: 'Custom',
        code: 'MF_CUS'
    }, {
        id: 3,
        type: 'Audible',
        code: 'MF_AUD'
    }];


    /* Message template */
    $scope.messageTemplate = [{
        id: 1,
        type: 'T02'
    }, {
        id: 2,
        type: 'T03'
    }, {
        id: 3,
        type: 'T04'
    }];



     /* Target user group */
    $scope.targetUsrGrp = [{
        id: 1,
        type: 'GR_JPS'
    }, {
        id: 2,
        type: 'GR_NADMA'
    }, {
        id: 3,
        type: 'GR_JBPM'
    }, {
        id: 4,
        type: 'GR_JPAM'
    }, {
        id: 5,
        type: 'GR_PDRM'
    }   ];


    /* location Info Type */

    $scope.locationInfoType = [{
        id: 1,
        type: 'Text',
        code: 'LT_TXT'
    }, {
        id: 2,
        type: 'Shapefile',
        code: 'LT_SHP'
    }, {
        id: 3,
        type: 'Coordinate',
        code: 'LT_COD'
    }, {
        id: 4,
        type: 'WKT',
        code: 'LT_WKT'
    }];


    
    /* originator */

    $scope.originator = [{
        id: 1,
        type: 'IBM-IOC'
    }];

    /* severity level */
    
    $scope.severitylevel = [{
        id: 1,
        type: 'Normal',
        code:'SL_NML'
    }, {
        id: 2,
        type: 'Alert',
        code: 'SL_ALT'
    }, {
        id: 3,
        type: 'Warning',
        code: 'SL_WRN'
    }, {
        id: 4,
        type: 'Danger',
        code: 'SL_DNG'
    }];

     /* certainty level */
    
    $scope.certaintylevel = [{
        id: 1,
        type: 'Forecast',
        code: 'CL_01'
    }, {
        id: 2,
        type: 'Imminent',
        code: 'CL_02'
    }, {
        id: 3,
        type: 'Substantive',
        code: 'CL_03'
    }];

    
    $("#notifytype, #targetchannel").prop('disabled', true);
    

    $scope.hideFields = function(){
        $("#locationInfoType, #severitylevel, #certaintylevel, #state, #district, #datetimepicker1, #datetimepicker2").prop('disabled', true);
    };
    $scope.showFields = function(){
        $("#locationInfoType, #severitylevel, #certaintylevel, #state, #district, #datetimepicker1, #datetimepicker2").prop('disabled', false);
    };

    $scope.hideFields();

    $("#msgtype").change(function(){
        if(this.value != ""){
            $("#notifytype").prop('disabled', false);
        }else{
            $("#notifytype").val("");
            $("#targetchannel").val("");
            $("#channelFormSection").hide();
            $("#notifytype").prop('disabled', true);
            $("#targetchannel").prop('disabled', true);
        }
    });

    $("#notifytype").change(function(){
        if(this.value != ""){
            $("#targetchannel").prop('disabled', false);
        }else{
            $("#targetchannel").val("");
             $("#channelFormSection").hide();
            $("#targetchannel").prop('disabled', true);
        }
    });

    

    $("#targetchannel").change(function(){
        if(this.value != ""){
            $("#channelFormSection").show();
            $scope.showFields();
        }else{
            $("#channelFormSection").hide();
            $scope.hideFields();
        }
    });



    
}]);