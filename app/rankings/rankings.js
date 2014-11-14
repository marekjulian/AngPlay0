'use strict';

angular.module('myApp.rankings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/rankings', {
    templateUrl: 'rankings/rankings.html',
    controller: 'RankingsCtrl'
  });
}])

.controller('RankingsCtrl', [function() {

}]);