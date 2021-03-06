

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
    }
  }
});
