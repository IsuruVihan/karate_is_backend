const db = require('../models/index');
const Tournament = db.Tournament;
const TeamPlayer = db.TeamPlayer;
const Player = db.Player;

exports.createTournament =  async (req, res) => {
  const {name, venue, from, to, ongoing, result, team} = req.body;
  let participatedCount = 0;
  team.map((player) => {
    if (player.attendance) ++participatedCount;
  });
  if (!ongoing && (name == '' || venue == '' || from == '' || to == '' || result == '')) {
    return res.status(400).json({
      message: "Please fill all fields or put a tick on 'Mark as an ongoing tournament'"
    });
  } else if (participatedCount == 0) {
    return res.status(400).json({
      message: "There should be at-least one team player."
    });
  } else {
    const ongoingTournament = await Tournament.findAll({attributes: ['name'], where: {ongoing: true}});
    if (ongoing && ongoingTournament.length > 0) {
      return res.status(400).json({
        message: `There's already an ongoing tournament "${ongoingTournament[0].dataValues.name}"`
      });
    } else {
      const date = new Date();
      const today = (date.getFullYear())+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate());
      if (to < from) {
        return res.status(400).json({
          message: `Please recheck "From" and "To" date values.`
        });
      } else {
        if (ongoing && ((today < from) || (today > to))) {
          return res.status(400).json({
            message: `"From" date must be <= today's date & "To" date must be >= today's date. (Ongoing tournament)`
          });
        } else {
          Tournament.create({
            name: name == '' ? null : name,
            venue: venue == '' ? null : venue,
            from: from == '' ? null : from,
            to: to == '' ? null : to,
            ongoing: ongoing,
            result: result == '' ? null : result
          })
            .then((tournament) => {
              if (team.length > 0) {
                team.map(async (teamPlayer) => {
                  teamPlayer.attendance && await TeamPlayer.create({
                    achievements: teamPlayer.achievements,
                    TournamentId: tournament.id,
                    PlayerId: teamPlayer.id
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
    }
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

exports.getOngoingTournament = async (req, res) => {
  Tournament.findAll({
    include: [{
      model: TeamPlayer,
      attributes: ['id', 'achievements'],
      include: [{
        model: Player,
        attributes: ['id', 'firstName', 'lastName']
      }]
    }],
    where: {ongoing: 1}
  })
    .then((results) => {
      return res.status(200).json({
        tournaments: results
      });
    })
    .catch((error) => {
      console.log('> RETRIEVE ONGOING TOURNAMENT DETAILS ERROR: ', error);
      return res.status(400).json({
        message: 'Unable to retrieve ongoing tournament details.'
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
      .then(() => {
        let teamPlayerIds = [];
        team.map((teamPlayer) => {
          teamPlayerIds.push(teamPlayer.id);
        });
        TeamPlayer.destroy({ where: {id: teamPlayerIds}})
          .then(() => {
            team.map(async (teamPlayer) => {
              await TeamPlayer.create({
                achievements: teamPlayer.achievements,
                TournamentId: id,
                PlayerId: teamPlayer.Player.id
              });
            });
            return res.status(200).json({
              message: 'Tournament data has been updated successfully.'
            });
          })
          .catch((error2) => {
            console.log('> UPDATE TOURNAMENT DETAILS ERROR: ', error2);
            return res.status(400).json({
              message: 'Unable to update tournament details.'
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
