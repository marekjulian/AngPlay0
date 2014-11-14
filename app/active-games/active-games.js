'use strict';

angular.module('myApp.activeGames', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/active-games', {
    templateUrl: 'active-games/active-games.html',
    controller: 'ActiveGamesCtrl'
  });
}])

.controller('ActiveGamesCtrl', [function() {

}]);