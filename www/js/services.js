
var socket;
var users = [];
var dataApi ={
    users : users
}
$(document ).ready(function() {
    console.log( "APP ready" );
    socket = io('http://192.168.1.3:9000', {path: '/socket.io'});
    socket.emit('all users', 'hi');
    socket.on('all users', function(msg){
        console.log("ALL USERS RECEIVED:"+msg.toString());
        msg.forEach(function(userId){
            dataApi.users.push({ id : userId });
        });
        console.log("received users:"+dataApi.users.toString());


    });
});

angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Game', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

        dataApi.friends = friends;

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
//        console.log("users:"+users.toString());
      return users;
    },
    dataApi: function() {
        console.log("users:"+JSON.stringify(dataApi));
      return dataApi;
    }
  }
});
