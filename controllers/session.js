const db = require('../models/index');
const PracticeSession = db.PracticeSession;
const PracticeParticipant = db.PracticeParticipant;

exports.createSession =  async (req, res) => {
  const {venue, date, from, to, ongoing, present, coach} = req.body;
  if (!ongoing && (venue=='' || date=='' || from=='' || to=='')) {
    return res.status(400).json({
      message: "You should fill all fields because it's not marked as 'Ongoing session'."
    });
  } else {
    const date2 = new Date();
    const today = (date2.getFullYear())+"-"+((date2.getMonth()+1)<10?("0"+(date2.getMonth()+1)):(date2.getMonth()+1))+"-"+(date2.getDate());
    if (ongoing && (date != today)) {
      return res.status(400).json({
        message: `"Date" field must contain today's date because it is an ongoing session.`
      });
    } else {
      if (from > to) {
        return res.status(400).json({
          message: 'Re-check "From" and "To" fields.'
        });
      } else {
        if (present.length > 0) {
          PracticeSession.create({date: date, venue: venue, from: from, to: to, ongoing: ongoing, coach: coach})
            .then((practiceSession) => {
              present.map(async (participantId) => {
                await PracticeParticipant.create({PlayerId: participantId, PracticeSessionId: practiceSession.id});
              });
              return res.status(200).json({
                message: 'Practice session has been created successfully.'
              });
            })
            .catch((error) => {
              console.log('> CREATE PRACTICE SESSION ERROR: ', error);
              return res.status(400).json({
                message: 'Unable to create the practice session.'
              });
            });
        } else {
          return res.status(400).json({
            message: 'There should be at-least one player present for the session.'
          });
        }
      }
    }
  }
}

// exports.getPastTournaments = async (req, res) => {
//   Tournament.findAll({
//     where: {ongoing: 0},
//     include: [{
//       model: TeamPlayer,
//       attributes: ['id', 'achievements'],
//       include: [{
//         model: Player,
//         attributes: ['id', 'firstName', 'lastName']
//       }]
//     }]
//   })
//     .then((results) => {
//       return res.status(200).json({
//         tournaments: results
//       });
//     })
//     .catch((error) => {
//       console.log('> RETRIEVE PAST TOURNAMENT DETAILS ERROR: ', error);
//       return res.status(400).json({
//         message: 'Unable to retrieve past tournament details.'
//       });
//     });
// }
//
// exports.getOngoingTournament = async (req, res) => {
//   Tournament.findAll({
//     include: [{
//       model: TeamPlayer,
//       attributes: ['id', 'achievements'],
//       include: [{
//         model: Player,
//         attributes: ['id', 'firstName', 'lastName']
//       }]
//     }],
//     where: {ongoing: 1}
//   })
//     .then((results) => {
//       return res.status(200).json({
//         tournaments: results
//       });
//     })
//     .catch((error) => {
//       console.log('> RETRIEVE ONGOING TOURNAMENT DETAILS ERROR: ', error);
//       return res.status(400).json({
//         message: 'Unable to retrieve ongoing tournament details.'
//       });
//     });
// }
//
// exports.updateTournament = async (req, res) => {
//   const {id, name, venue, from, to, result, team} = req.body;
//   if (name=='' || venue=='' || from=='' || to=='' || result=='') {
//     return res.status(400).json({
//       message: 'All fields must be filled.'
//     });
//   } else if (team.length==0) {
//     return res.status(400).json({
//       message: 'Team should have at-least one player.'
//     });
//   } else {
//
//
//     const date = new Date();
//     const today = (date.getFullYear())+"-"+((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate());
//     if (to < from) {
//       return res.status(400).json({
//         message: `Please recheck "From" and "To" date values.`
//       });
//     } else {
//       if ((today < from) || (today > to)) {
//         return res.status(400).json({
//           message: `"From" date must be <= today's date & "To" date must be >= today's date. (Ongoing tournament)`
//         });
//       } else {
//         Tournament.update({
//           name: name,
//           venue: venue,
//           from: from,
//           to: to,
//           result: result
//         }, {where: {id: id}})
//           .then(() => {
//             let teamPlayerIds = [];
//             team.map((teamPlayer) => {
//               teamPlayerIds.push(teamPlayer.id);
//             });
//             TeamPlayer.destroy({ where: {id: teamPlayerIds}})
//               .then(() => {
//                 team.map(async (teamPlayer) => {
//                   await TeamPlayer.create({
//                     achievements: teamPlayer.achievements,
//                     TournamentId: id,
//                     PlayerId: teamPlayer.Player.id
//                   });
//                 });
//                 return res.status(200).json({
//                   message: 'Tournament data has been updated successfully.'
//                 });
//               })
//               .catch((error2) => {
//                 console.log('> UPDATE TOURNAMENT DETAILS ERROR: ', error2);
//                 return res.status(400).json({
//                   message: 'Unable to update tournament details.'
//                 });
//               });
//           })
//           .catch((error) => {
//             console.log('> UPDATE TOURNAMENT DETAILS ERROR: ', error);
//             return res.status(400).json({
//               message: 'Unable to update tournament details.'
//             });
//           });
//       }
//     }
//   }
// }
