// Initialize your app
/*
var myApp = new Framework7({
	material: true,
	swipePanel: 'left'
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

// Show/hide preloader for remote ajax loaded pages
// Probably should be removed on a production/local app
$$(document).on('ajaxStart', function (e) {
    myApp.showIndicator();
});
$$(document).on('ajaxComplete', function () {
    myApp.hideIndicator();
});

$$(document).on('pageInit', function (e) {
	$(".swipebox").swipebox();
	$(".videocontainer").fitVids();
	
	var page = e.detail.page;
	if (page.name === 'login') {
		myApp.params.swipePanel = false;
	} else if(page.name === 'register') {
		myApp.params.swipePanel = false;
	} else if(page.name === 'remember') {
		myApp.params.swipePanel = false;
	} else {
		myApp.params.swipePanel = 'left';
	}
	// Action Sheet to Share Posts
	$('.share-post').on('click', function () {

		var buttons = [
			{
				text: '<span class="text-thiny">Share this post with your friends</span>',
				label: true
			},
			{
				text: '<span class="text-small share-post-icon share-post-facebook"><i class="flaticon-facebook"></i> Share on Facebook</span>',
			},
			{
				text: '<span class="text-small share-post-icon share-post-twitter"><i class="flaticon-twitter"></i> Share on Twitter</span>',
			},
			{
				text: '<span class="text-small share-post-icon share-post-whatsapp"><i class="flaticon-whatsapp"></i> Share on Whatsapp</span>',
			},
			{
				text: '<span class="text-small">Cancel</span>',
				color: 'red'
			},
		];
		myApp.actions(buttons);
	});
});
*/

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady()
{
    document.addEventListener("backbutton", onBackKeyPress, false);
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
        return false;
        //navigator.app.exitApp();
    }
    else if(z[length-1] == "tab")
    {
        //alert("this is tab");
        return false;
        //navigator.app.exitApp();
    }
    else
    {
        return true;
    }
}
function onSuccess(mediaFiles) {
      var i, path, len;
      for (i = 0, len = mediaFiles.length; i < len; i += 1) {
         path = mediaFiles[i].fullPath;
         console.log(mediaFiles);
         jQuery("#record_time").html(mediaFiles);
      }
   }
function onError(error) {
      navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
   }
function recordAudio()
{
        alert("record audio");
        //https://www.tutorialspoint.com/cordova/cordova_media_capture.htm
        var options = {
              limit: 1,
              duration: 10
           };
        navigator.device.capture.captureAudio(onSuccess, onError, options);
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
        //alert("user");
        if(localStorage.username == undefined)
        {
            //window.location.href="/";
            $location.path("/");
        }
    }
    else
    {
        if(localStorage.username != undefined)
        {
            //window.location.href="/#!/tab";
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
var service_url = "http://econstrademosite.com/advicegate/service.php";
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
    });
});
app.controller("listing",function($scope,$http,$location,$timeout, $mdSidenav)
{
    //for menu
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }
    
    
    
    
    check_session("session",$location);
    var category_id = get_id_from_url();
    var data = {"todo":"get_post","cat_id":category_id};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
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
    
    
    
    
    check_session("session",$location);
    var single_id = get_id_from_url();
     var data = {"todo":"get_content","single_id":single_id};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
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
app.controller("tabs",function($scope,$location,$http,$timeout, $mdSidenav)
{
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
         var data = {"todo":"fetch_category"};
         $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
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
            var data = {"todo":"requirement","user":localStorage.username,"requirement":val};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                var data_obj = response.data.status;
                if(data_obj == "success")
                {
                    var mail_url = "mailto:"+admin_email+"?subject=Enquiry From "+data.user+"&body="+data.requirement;
                    window.location.href = mail_url;
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
    check_session("guest",$location);
    $scope.register = function(username,email,password)
    {
        if(username != undefined && email != undefined && password != undefined)
        {
            var data = {"todo":"register","username": username,"email":email,"password":password};
            $http({
                url: service_url,
                method: "GET",
                params: data
            }).then(function(response)
            {
                var data_obj = response.data;
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
    check_session("guest",$location);
    $scope.login = function(username,password)
    {
        if(username != undefined && password != undefined)
        {
            var data = {"todo": "login","username": username,"password": password};
            $http({
                url: service_url, 
                method: "GET",
                params: data
            }).then(function(response)
            {
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