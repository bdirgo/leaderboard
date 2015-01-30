Meteor.publish('thePlayers', function(){
  var currentUserId = this.userId;
  return PlayersList.find({createdBy:currentUserId});
});

Meteor.methods({
	'sendLogMessage':function(message){
		console.log('Hello World', message);
	},
	'insertPlayerData':function(playerNameVar){
		var currentUserId = Meteor.userId();
		PlayersList.insert({
			name:playerNameVar,
			score:0,
			createdBy:currentUserId
		});
	},
	'removePlayerData':function(selectedPlayer){
		PlayersList.remove(selectedPlayer);
	},
	'modifyPlayerScore':function(selectedPlayer, scoreValue){
		PlayersList.update(selectedPlayer,{$inc:{score:scoreValue}});
	}
});