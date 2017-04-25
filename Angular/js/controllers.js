'use strict';
var base = 'http://127.0.0.1:3300';

/* Controllers */

angular.module('Friska.controllers', [])
 
.controller('SigninCtrl', function ($scope, $http) {
  $scope.user_account = {
    name: '',
    phonenumber: '',
    email_address: '',
    password: ''
  }
  $scope.test = function(){
    /*$http.get(base + '/').then(function(res){
      console.log(res);
      $scope.kkk = res;
    });*/
    console.log($scope.user_account.name);
  }
});