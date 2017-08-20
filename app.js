'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngAnimate'
])
.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider.when('/', {
        templateUrl: 'search.html',
        controller: 'HomeCtrl as ctrl',
        title: 'Search Engine'
    })
    .when('/recognition', {
        templateUrl: 'recognition.html',
        controller: 'RecogCtrl as ctrl',
        title: 'Recognition'
    })
    .when('/tag', {
      templateUrl: 'tag.html',
      controller: 'TagCtrl as ctrl',
      title: 'Smart Tags'
    })
    .when('/dash', {
      templateUrl: 'dash.html',
      controller: 'TagCtrl as ctrl',
      title: 'Dashboard'
    })
    .otherwise({
    	redirectTo: '/'
    });

	$locationProvider.html5Mode(true);
})
.controller('HomeCtrl', function($scope, $route, $routeParams, $location, $http) {
  this.query = '';
  this.queryProcessed = false;

  this.resetSearch = function() {
    this.queryProcessed = false;
    this.queryResults = null;
    this.query = "";
    this.timeElapsed = 0;
  }

  this.submitQuery = function() {
    if(this.query==""){
      return;
    }
    this.queryProcessed = true;
    this.queryResults = null;
  }
})
.controller('RecogCtrl', function($scope, $route, $routeParams, $location, $http) {
  angular.element(document).ready(function () {
    var imageLoader = document.getElementById('filePhoto');
    imageLoader.addEventListener('change', handleImage, false);
  });

  function handleImage(e) {
      var reader = new FileReader();
      reader.onload = function (event) {
          $('.uploader img').attr('src',event.target.result);
      }
      reader.readAsDataURL(e.target.files[0]);
  }
})
.controller('TagCtrl', function($scope, $http){
  var accessToken = "a0e3d49509684e11a150e8afff2022e8";
  var baseUrl = "https://api.api.ai/v1/";
  this.response_list = [];
  this.inputtedTags = [];
  this.displayTags = [];
  var self = this;
  this.appendTag = function(e){
    if(e.keyCode == 13){
      e.preventDefault();
      self.inputtedTags.push(self.d1);
      self.sendRequest(self.inputtedTags[self.inputtedTags.length-1]);
      self.d1 = '';
    }
  }
  function generateCircle(color){
    return '<div style="display: inline-block; border-radius: 5rem; width: 20px; height: 20px; background-color: '+ color +'"></div>';
  }
  this.sendRequest = function(input){
    $http({
      method: 'POST',
      url: baseUrl + "query?v=20170819",
      headers: {
         'Content-Type': 'application/json; charset=utf-8',
         'Authorization': 'Bearer' + accessToken
       },
      data: JSON.stringify({
        query: input,
        lang: "en",
        sessionId: "random"
      })
    }).then(function successCallback(response) {
      if(response.data){
        var hasMisc = false;
        var tags = response.data.result.fulfillment.speech.split(' ').map(function(a){
          if(a=='Misc'){
            hasMisc = true;
          }
          return a;
        })
        if(!hasMisc){
          self.displayTags.push(tags);
        }
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

this.handleImage = function(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        $("#file_logo").hide();
        $('#uploaded').show();
        $('#uploaded').attr('src',event.target.result);
        self.img_data = event.target.result;
                console.log('fired');
        var passable = self.makeblob(self.img_data);
        img_post(passable);
    }
    reader.readAsDataURL(e.target.files[0]);

    // img_post(self.makeblob(data));
}

// function previewFile(){
//     // var preview = document.getElementById("uploaded");
//     var file = document.querySelector('input[type=file]').files[0];
//     var reader = new FileReader();


// }


this.makeblob = function(dataURL){
    var base64_maker = ';base64,';
    var parts = dataURL.split(base64_maker);
    var contentType = parts[0].split(':')[1];
    var raw  = window.atob(parts[1]);
    var rawLength = raw.length;
    var uint8arr = new Uint8Array(rawLength);
    for (var i=0; i<rawLength; i++){
      uint8arr[i] = raw.charCodeAt(i);
    }
    return new Blob([uint8arr], {type:contentType});
  }
function json_parser(descriptions){
    // text = document.getElementById('jsondisplay');
    var display_json = feat_extract(descriptions);
    return display_json;
        // console.log(display_json);
        // self.azure = display_json;
    // text.value = JSON.stringify(display_json, null, 4);
  }

function feat_extract(jsonformat){
  //This is specific to ms azure
  var tags = jsonformat['description']['tags'];
  var verbal_description = jsonformat['description']['captions'];
  var colors = jsonformat['color']['dominantColors'];


    var ind = tags.indexOf('indoor')
    var outd = tags.indexOf('outdoor')
    if (ind>0){
        // console.log('indoor'.indexOf(tag))
        tags.splice(ind,1)
    }
    else if (outd){
        tags.splice(outd,1)
    }

  var proc_json = {
    'tags':tags.splice(0,3),
    'description': verbal_description,
    'dominant colors':colors
  }
  return proc_json
}
function img_post(raw_data) {
    self.azured = true;
    var params = {
        // Request parameters
        "visualFeatures":'Categories, Tags, Description, Color',
        "language":'en'
    };

    $http({
      method: 'POST',
      url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
      headers: {
         'Content-Type': 'application/octet-stream',
         "Ocp-Apim-Subscription-Key": "a947bbe94cb342d3baecae9040362f4d"
       },
      data: raw_data
    }).then(function successCallback(response) {
      self.azure = json_parser(response.data);
      self.azure_colors = self.azure['dominant colors'].reduce(function(acc, a){
        return acc+generateCircle(a);
      },'')
      console.log(self.azure);
    });
  
    // $.ajax({
    //     url: "https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?" + $.param(params),
    //     beforeSend: function(xhrObj){
    //         // Request headers
    //         xhrObj.setRequestHeader("Content-Type","application/octet-stream");
    //         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","a947bbe94cb342d3baecae9040362f4d");
    //     },
    //     type: "POST",
    //     // Request body
    //     data: raw_data,
    //     processData:false
    // })
    // .done(function(data) {
    //   self.azure = json_parser(data);
    // })
};
})
.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeHandler);
    }
  };
})
.run(['$rootScope','$window', function($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);