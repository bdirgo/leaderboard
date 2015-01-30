Meteor.subscribe('thePlayers');

// Helper functions execute code within templates
Template.leaderboard.helpers({
  'player': function(){

      //find the current user Id
      //var currentUserId = Meteor.userId();
      // Retrieve all of the data from the "PlayersList" collection
      return PlayersList.find({}, {sort: {score: -1, name: 1}})

  },
  'selectedClass': function(){

      // Get the ID of the player being iterated through
      var playerId = this._id;

      // Get the ID of the player that's been clicked
      var selectedPlayer = Session.get('selectedPlayer');

       // Do these IDs match?
      if(playerId == selectedPlayer){

          // Return a CSS class
          return "selected"
      }

  },
  'showSelectedPlayer':function(){


    var selectedPlayer = Session.get('selectedPlayer');


    return PlayersList.findOne(selectedPlayer);
  }
});

// Events trigger code when certain actions are taken
Template.leaderboard.events({
    'click .player': function(){

        // Retrieve the unique ID of the player that's been clicked
        var playerId = this._id;

        // Create a session to store the unique ID of the clicked player
        Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){

        //find the current player selected
        var selectedPlayer = Session.get('selectedPlayer');

        //increment just the score value of the player selected
        Meteor.call('modifyPlayerScore',selectedPlayer,5);
    },
    'click .decrement': function(){

        //find the current player selected
        var selectedPlayer = Session.get('selectedPlayer');

        //decrement just the score value of the player selected
        Meteor.call('modifyPlayerScore', selectedPlayer,-5);
    },
    'click .remove': function(){
      //Confirm they wnat to remove the player
      var confirmation = true;//confirm("Are you sure you wish to remove the player selected?");
      if (confirmation) {

        // Get the ID of the player that's been clicked
        var selectedPlayer = Session.get('selectedPlayer');

        // Remove a document from the collection
        Meteor.call('removePlayerData', selectedPlayer);
      };
    }
});

Template.addPlayerForm.events({
    'click .submit': function(event){

      //prevent the default browser action of refreshing the page
      event.preventDefault();

      //get the value of the players name in the form 
      var playerNameVar = document.getElementById('playerName').innerHTML;

      //remove the text from the screen
      document.getElementById('playerName').innerHTML = "";

      Meteor.call('sendLogMessage', playerNameVar)
      Meteor.call('insertPlayerData', playerNameVar);
    }
});
