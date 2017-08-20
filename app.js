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
.controller('TagCtrl', function($http){
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
})
.run(['$rootScope','$window', function($rootScope, $window) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);