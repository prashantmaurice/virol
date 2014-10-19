
var socket;
var users = [];
var dataApi ={
    users : users
}
var refreshControllers = [];
var debug ="nothing";
$(document ).ready(function() {
    console.log( "APP ready" );
    socket = io('http://192.168.1.10:9000', {path: '/socket.io'});
    socket.emit('all users', 'hi');
    socket.on('all users', function(msg){
        console.log("ALL USERS RECEIVED:"+msg.toString());
        dataApi.users.splice(0,dataApi.users.length);
//        console.log("received users:"+JSON.stringify(dataApi.users));
        msg.forEach(function(userId){
            dataApi.users.push({ id : userId });
        });
        console.log("received users:"+JSON.stringify(dataApi.users));
        dataApi.debug+=JSON.stringify(dataApi.users);
        for(var i=0;i<refreshControllers.length;i++){
            console.log("REFRESHING STACK"+i);
            refreshControllers[i]();
        }


    });
});

angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Game', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  this.debug2 = "FIRST";
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];


        dataApi.friends = friends;
        dataApi.debug = debug;

  return {
    add: function() {
        friends.push( { id: 4, name: 'Scruf23245356f McGruff' });
      return friends;
    },
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    },
    getSocket: function() {
      return socket;
    },
    allUsers: function() {
        console.log("users:"+users.toString());
      return dataApi.users;
    },
    dataApi: function() {
        console.log("users:"+JSON.stringify(dataApi));
      return dataApi;
    },
    debug:function() {
        console.log("DATAAPI:"+JSON.stringify(dataApi));
        return dataApi.debug;
    },
    addController:function(func) {
        refreshControllers.push(func)
      return dataApi.debug;
    }
  }
})

.service('Data', [function() {
    this.data = "FIRST";
    var context = this;
    this.weatherChange = function() {
        console.log(this.data);
        this.data = "SECOND";
        console.log(this.data);
    };
//    setTimeout(function(){context.weatherChange()},2500);
}])
.service("Monster", [function(){

    this.alive = false;
        var context = this;
//
    this.weatherChange2 = function(context) {
        console.log("WEATHER CHAGED");
        context.alive = true;
    };

    setTimeout(function(){context.weatherChange2(context)},2500);

}])
.controller("MadScientistCtrl", ["$scope", "Monster", function($scope, Monster) {
        $scope.alive = Monster.alive;

        $scope.$watch(
            function(){ return Monster.alive },

            function(newVal) {
                console.log('asfsagsgdhdfddddddffffffffffffff');
                $scope.alive = newVal;
            }
        )
}]);
