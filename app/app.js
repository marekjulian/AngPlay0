'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.controllers.AppCtrl',
  'myApp.services.GameStats',
  'myApp.rankings',
  'myApp.activeGames',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/rankings'});
}]);
