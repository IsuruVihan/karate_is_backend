const db = require('../models/index');
const Tournament = db.Tournament;
const TeamPlayer = db.TeamPlayer;

exports.createTournament = async (req, res) => {
  const {name, venue, from, to, ongoing, result, team} = req.body;
  if (!ongoing && (name=='' || venue=='' || from=='' || to=='' || result=='' || team.length==0)) {
    return res.status(400).json({
      message: "Please fill all fields or put a tick on 'Mark as an ongoing tournament'"
    });
  } else {
    Tournament.create({
      name: name,
      venue: venue,
      from: from,
      to: to,
      ongoing: ongoing,
      result: result
    })
      .then((tournament) => {
        if (team.length>0) {
          team.map(async (teamPlayer) => {
            await TeamPlayer.create({
              achievements: teamPlayer.achievements,
              TournamentId: tournament.id,
              PlayerId: teamPlayer.playerId
            });
          });
        }
        return res.status(200).json({
          message: 'Tournament has been created successfully.'
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: 'Unable to create the tournament.'
        });
        console.log('> CREATE TOURNAMENT ERROR: ', error);
      });
  }
}

exports.getTournaments = async (req, res) => {
  Tournament.findAll({
    include: [{
      model: TeamPlayer,
      attributes: ['id', 'achievements'],
      include: [{
        model: Player,
        attributes: ['firstName', 'lastName']
      }]
    }]
  })
    .then((results) => {
      return res.status(200).json({
        tournaments: results
      });
    })
    .catch((error) => {
      console.log('> RETRIEVE TOURNAMENT DETAILS ERROR: ', error);
      return res.status(400).json({
        message: 'Unable to retrieve tournament details.'
      });
    });
}

exports.updateTournament = async (req, res) => {
  const {id, name, venue, from, to, result, team} = req.body;
  if (name=='' || venue=='' || from=='' || to=='' || result=='') {
    return res.status(400).json({
      message: 'All fields must be filled.'
    });
  } else if (team.length==0) {
    return res.status(400).json({
      message: 'Team should have at-least one player.'
    });
  } else {
    Tournament.update({
      name: name,
      venue: venue,
      from: from,
      to: to,
      result: result
    }, {where: {id: id}})
      .then((tournament) => {
        let teamPlayerIds = [];
        team.map((teamPlayer) => {
          teamPlayerIds.push(teamPlayer.id);
        });
        TeamPlayer.destroy({ where: {id: teamPlayerIds}})
          .then(() => {
            team.map(async (teamPlayer) => {
              await TeamPlayer.create({
                achievements: teamPlayer.achievements,
                TournamentId: tournament.id,
                PlayerId: teamPlayer.playerId
              });
            });
            return res.status(200).json({
              message: 'Unable to update tournament details.'
            });
          })
          .catch((error2) => {
            console.log('> UPDATE TOURNAMENT DETAILS ERROR: ', error2);
            return res.status(200).json({
              message: 'Tournament details updated successfully.'
            });
          });
      })
      .catch((error) => {
        console.log('> UPDATE TOURNAMENT DETAILS ERROR: ', error);
        return res.status(400).json({
          message: 'Unable to update tournament details.'
        });
      });
  }
}
