'use strict';

angular.module('Friska', ['ngRoute', 'Friska.controllers'])

.config(function ($routeProvider) {
    $routeProvider.when('/auth/signin', {
    	templateUrl: 'templates/authentication/signin.html', 
    	controller: 'SigninCtrl'
    });
    $routeProvider.when('/auth/signup', { 
    	templateUrl: 'templates/authentication/signup.html'/*,
    	controller: 'SignupCtrl' */
    });
    $routeProvider.when('/auth/forgotpassword', {
    	templateUrl: 'templates/authentication/forgotpassword.html' 
    });
    $routeProvider.otherwise({ redirectTo: '/auth/signin' });
});

