angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Game, Data) {
//        console.log("RELOAD");
    $scope.allusers = Game.allUsers();
    $scope.debug = Game.debug();
    $scope.data = Data.data;
//    $scope.$watch(
//        function(){ return Data.data },
//        function(newVal) {
//            console.log("CALLED WATCH");
//            $scope.data = newVal;
//        }
//    );
   $scope.refresh = function(){
//       $scope.data = Data.data;
       $scope.allusers = Game.allUsers();
       $scope.debug = Game.debug();
       $scope.data = Data.data;
       console.log("BUTTON:REFRESH");
   }
    Game.addController($scope.refresh);
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
