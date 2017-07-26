var live_link = "http://181.215.99.99/econstra/advicegate/";
var service_url = live_link+"service.php";
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady()
{
    console.log(navigator.device.capture);
    document.addEventListener("backbutton", onBackKeyPress, false);
    var permissions = cordova.plugins.permissions;

    permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, success, error);

    function error() {
      console.warn('External Data permission is not turned on');
    }

    function success( status ) {
      if( !status.hasPermission ) error();
    }
}
document.addEventListener("backbutton", onBackKeyPress, false);



function onBackKeyPress()
{
    var page_url = document.location.href;
    var z = page_url.split("/");
    var length = z.length;
    if(z[length-1] == "")
    {
        //alert("this is home");
        navigator.app.exitApp();
        return false;
    }
    else if(z[length-1] == "tab")
    {
        //alert("this is tab");
        navigator.app.exitApp();
        return false;
    }
    else
    {
        return true;
    }
}
function onSuccess(files)
{
    //alert("files - "+JSON.stringify(files));
    for ( var i in files )
    {
        var file = files[i];
        var name = file.name;
        var path = file.fullPath;
        var type = file.type;
        var lastModifiedDate = file.lastModifiedDate;
        var size = file.size;
        var reader = new FileReader();
        file.end = file.size; //onload
            reader.onloadend = function(evt) {
                var data = {"todo":"requirement","user":localStorage.username,"requirement":evt.target.result, "file":1};
                jQuery("#loading").html("Your requirement sending plz wait!!!");
                jQuery.post(service_url,data,function(get_data)
                {
                    jQuery("#loading").html(" ");
                    if(get_data.status == "success")
                    {
                        swal({ title: "Success", text: "Your requirement send successfully", type: "success" }, function()
                        {
                                    window.location.href = "#!tab";
                        });
                    }
                    else
                    {
                        swal("alert","Your requitement send failed");
                    }
                });
            };
            reader.readAsDataURL(file);

    }
}
function onError(error)
{
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
}
function recordAudio()
{
    var options = { limit: 1  }; //, duration: 10
    navigator.device.capture.captureAudio(onSuccess, onError, options); //for audio capture
    //navigator.device.capture.captureImage(onSuccess, onError, options); //for image capture
}
var admin_email = "rohitmajumder1983@gmail.com";
function get_id_from_url()
{
    var current_url = document.location.href;
    var url_spl = current_url.split("?");
    var query_str_part = url_spl[1];
    var query_part = query_str_part.split("=");
    return query_part[1];
}
function check_session(type,$location)
{
    //alert(localStorage.username);
    if(type == "session")
    {
        if(localStorage.username == undefined)
        {
            $location.path("/");
        }
    }
    else
    {
        if(localStorage.username != undefined)
        {
            $location.path("/tab");
        }
    }
}
function logout()
{
        swal({
          title: "Are you sure?",
          text: "Do you really want to log out ?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Logout",
          closeOnConfirm: false
        },
        function(){
                      swal("Logout Successfully!", "Ypu have been loggedout successfully", "success");
                      localStorage.email = undefined;
                      localStorage.username = undefined;
                      localStorage.removeItem("email");
                      localStorage.removeItem("username");
                      window.location.href = "#!";
        });
}
var app = angular.module("business", ["ngRoute","ngSanitize","ngMaterial"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "template/landing.html"
    })
    .when("/login",
    {
        templateUrl : "template/login.html"
    })
    .when("/register",
    {
        templateUrl : "template/register.html"
    })
    .when("/tab",
    {
        templateUrl : "template/tabs.html"
    })
    .when("/listing",
    {
        templateUrl : "template/listing.html"
    })
    .when("/single",
    {
        templateUrl : "template/single.html"
    })
    .when("/activity",
    {
            templateUrl : "template/activity.html"
    });
});
app.controller("listing",function($scope,$http,$location,$timeout, $mdSidenav)
{
    //for menu
    $scope.loading=false;
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
    
    
    
    
    check_session("session",$location);
    var category_id = get_id_from_url();
    $scope.loading=true;
    var data = {"todo":"get_post","cat_id":category_id};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                $scope.loading=false;
                var data_obj = response.data.data;
                var total_result = data_obj.total_result;
                var result = data_obj.result;
                if(total_result > 0)
                {
                    $scope.posts = result;
                }
            });
    
});
app.controller("single",function($scope,$http,$location,$timeout, $mdSidenav)
{
    //for menu
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
    
    
    $scope.loading=false;
    
    check_session("session",$location);
    var single_id = get_id_from_url();
    $scope.loading=true;
     var data = {"todo":"get_content","single_id":single_id};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                $scope.loading=false;
                var data_obj = response.data.data;
                var total_result = data_obj.total_result;
                var result = data_obj.result;
                if(total_result > 0)
                {
                    $scope.title = result.title;
                    $scope.text = result.text;
                    $scope.single_image = result.image;
                    $scope.username = data_obj.user.username;
                }
            });
});
app.controller("landing",function($location)
{
    check_session("guest",$location);
});
app.controller("activity", function($scope,$location,$http,$mdSidenav)
{
    $scope.loading=false;
    //for menu
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
          return function() {
            $mdSidenav(componentId).toggle();
          };
        }


        check_session("session",$location);
        $scope.loading=true;
        var data = {"todo":"activity","user":localStorage.username};
                 $http({
                        url: service_url,
                        method: "GET",
                        params: data
                    }).then(function(response)
                    {
                        var data_obj = response.data;
                        $scope.loading=false;
                        if(data_obj.status == "success")
                        {
                            $scope.posts = data_obj.data;
                        }
                    });
});
app.controller("tabs",function($scope,$location,$http,$timeout, $mdSidenav)
{
    //For loader start
    $scope.loading=false;
    //For loader stop
    //for menu
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
    
    
    check_session("session",$location);
    $scope.get_categories = function()
    {
        $scope.loading=true;
         var data = {"todo":"fetch_category"};
         $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                $scope.loading=false;
                var data_obj = response.data.data;
                if(data_obj.total_result>0)
                {
                    $scope.catagories = data_obj.result;
                }
            });
    }
    $scope.thankyou = "";
    $scope.send_requirement = function(val)
    {
        if(val == undefined)
        {
            swal("Error","Please Enter Your Requirement");
        }
        else
        {
            $scope.loading=true;
            var data = {"todo":"requirement","user":localStorage.username,"requirement":val, "file":0};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                $scope.loading=false;
                var data_obj = response.data.status;
                if(data_obj == "success")
                {
                    var mail_url = "mailto:"+admin_email+"?subject=Enquiry From "+data.user+"&body="+data.requirement;
                    //window.location.href = mail_url;
                    $scope.showthankyou = true;
                    $scope.thankyou = "Thank You For Your Requirement Our Executive Will Contact You Shortly";
                    $timeout(function () { $scope.showthankyou = false; }, 3000);
                    $scope.userrequirement = "";
                    $scope.userrequirement = undefined;
                }
            });
        }
    }
    $scope.record_audio = function()
    {
        recordAudio();
    }
});
app.controller("register", function($scope,$http,$location)
{
    $scope.loading=false;
    check_session("guest",$location);
    $scope.register = function(username,email,password)
    {
        if(username != undefined && email != undefined && password != undefined)
        {
            var data = {"todo":"register","username": username,"email":email,"password":password};
            $scope.loading=true;
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                var data_obj = response.data;
                $scope.loading=false;
                if(data_obj.status == "success")
                {
                    var data = data_obj.data;
                    localStorage.username = data.username;
                    localStorage.email = data.email;
                    $location.path("/tab");
                }
                else
                {
                    swal("Error",data_obj.data);
                }
            });
        }
        else
        {
            swal("Error","All Data required");
        }
    }
});
app.controller('login', function($scope,$http,$location) 
{
    $scope.loading=false;
    check_session("guest",$location);
    $scope.login = function(username,password)
    {
        if(username != undefined && password != undefined)
        {
            $scope.loading=true;
            var data = {"todo": "login","username": username,"password": password};
            $http({
                url: service_url, 
                method: "GET",
                params: data
            }).then(function(response)
            {
                $scope.loading=false;
                var data_obj = response.data;
                if(data_obj.status == "success")
                {
                    //alert("login successful");
                    var data = data_obj.data;
                    localStorage.username = data.username;
                    localStorage.email = data.email;
                    $location.path("/tab");
                }
                else
                {
                    swal("Error",data_obj.data);
                }
            });
        }
        else
        {
            swal("Error","All Data required");
        }
    }
});