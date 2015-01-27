
// Create a MongoDB Collection
PlayersList = new Mongo.Collection('players');

// Code that only runs on the client (within the web browser)
if(Meteor.isClient){

  Meteor.subscribe('thePlayers');

  // Helper functions execute code within templates
  Template.leaderboard.helpers({
    'player': function(){

        //find the current user Id
        var currentUserId = Meteor.userId();
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
          PlayersList.update(selectedPlayer, {$inc:{score:5}});
      },
      'click .decrement': function(){

          //find the current player selected
          var selectedPlayer = Session.get('selectedPlayer');

          //increment just the score value of the player selected
          PlayersList.update(selectedPlayer, {$inc:{score:-5}});
      },
      'click .remove': function(){
        //Confirm they wnat to remove the player
        var confirmation = confirm("Are you sure you wish to remove the player selected?");
        if (confirmation) {

          // Get the ID of the player that's been clicked
          var selectedPlayer = Session.get('selectedPlayer');

          // Remove a document from the collection
          PlayersList.remove(selectedPlayer);
        };
      }
  });

  Template.addPlayerForm.events({
      'submit form': function(event){

        //prevent the default browser action of refreshing the page
        event.preventDefault();

        //get the value of the players name in the form 
        var playerNameVar = event.target.playerName.value;

        //store the Id of the currently logged in user
        var currentUserId = Meteor.userId();

        //add the name passed in and assign it with a default value of 0
        PlayersList.insert({
          name: playerNameVar,
          score: 0,
          createdBy: currentUserId
        });

        //remove the text from the screen
        event.target.playerName.value = "";
      }
  });

}

// Code that only runs on the server (where the application is hosted)
if(Meteor.isServer){
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy:currentUserId});
  });
}



