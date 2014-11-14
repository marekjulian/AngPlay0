//
// AppCtrl.js: Parent controller, ie: referenced in index.html.
//

angular.module('myApp.controllers.AppCtrl', []).controller('AppCtrl', [
  '$scope', 
  'GameStatsService',
	function($scope, GameStatsService) {
    var logPrefix = 'MyApp.controllers.AppCtrl: ';

    $scope.king = "No Foosball king yet, lets start playing!";

    if (GameStatsService.rankings.length) {
      var ranking = GameStatsService.rankings[0];
      console.log(logPrefix + 'Updating the Foosball king to - ' + ranking.player);
      $scope.king = ranking.player;
    }
  }
]);