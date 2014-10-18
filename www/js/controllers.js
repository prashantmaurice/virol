angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Game) {
    $scope.allusers = Game.allUsers();
})

.controller('FriendsCtrl', function($scope, Game) {
  $scope.dataApi = Game.friends;
  setTimeout(function(){Game.add(); console.log("ADDED");},1500);

})

.controller('FriendDetailCtrl', function($scope, $stateParams, Game) {
  $scope.friend = Game.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
