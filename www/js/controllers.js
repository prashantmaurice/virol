angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicSlideBoxDelegate) {
//        $scope.users = Game.users();
        redrawUsersOnline();
        $scope.init = function() {
            $ionicSlideBoxDelegate.enableSlide(false)
        };
        $scope.nextSlide = function () {
            $ionicSlideBoxDelegate.next();
            startGameCmd();
        };
        $scope.prevSlide = function () {
            $ionicSlideBoxDelegate.previous();
        };
})

.controller('FriendsCtrl', function($scope, Game) {
  $scope.dataApi = Game.friends;
//  setTimeout(function(){Game.add(); console.log("ADDED");},1500);

})

.controller('FriendDetailCtrl', function($scope, $stateParams, Game) {
  $scope.friend = Game.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
