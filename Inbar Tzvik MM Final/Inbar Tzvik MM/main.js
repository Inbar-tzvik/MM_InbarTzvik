var http = require('http');
var fs = require('fs');
var path = require('path');
var parse = require("csv-parser");

async function readCsvFileUpcoming(){  //read csv file of upcoming games
    const csvData=[];
    return new Promise((resolve, reject) => {
        fs.createReadStream('result_upcoming.csv') 
            .pipe(parse({delimiter:','}))
            .on('data',function(dataRow){
                csvData.push(dataRow);
            })
            .on('end',function(){
               
                resolve(csvData);
            })
    });
}
async function readCsvFilePlayed(){  //read csv file of played games
    const csvData1=[];
    return new Promise((resolve, reject) => {
        fs.createReadStream('result_played.csv') 
            .pipe(parse({delimiter:','}))
            .on('data',function(dataRow){
                csvData1.push(dataRow);
            })
            .on('end',function(){
               
                resolve(csvData1);
            })
    });
}
async function getMatchesByTeamUpcoming(teamID,csvUpcoming){  //find by team id there upcoming matches
    const csvData=[];
    for(var i=0;i<csvUpcoming.length;i++){
        if(csvUpcoming[i]['home_team']==teamID ||csvUpcoming[i]['away_team']==teamID){
            csvData.push(csvUpcoming[i]);
        }
    }                      
    return csvData;
}
async function getMatchesByTeamPlayed(teamID,csvPlayed){  //find by team id there played matches
    const csvData5=[];
    for(var i=0;i<csvPlayed.length;i++){
        if(csvPlayed[i]['home_team']==teamID ||csvPlayed[i]['away_team']==teamID){
            csvData5.push(csvPlayed[i]);
        }
    }
    return csvData5;
}
async function getMatchesByTournamentUpcoming(tournament,csvUpcoming){  //find by Tournament the upcoming matches
    const csvData4=[];
    for(var i=0;i<csvUpcoming.length;i++){
        if(csvUpcoming[i]['tournament']==tournament ){
            csvData4.push(csvData4[i]);
        }
    }
    return csvData4;
}
async function getMatchesByTournamentPlayed(tournament,csvPlayed){  //find by Tournament the played matches
    const csvData3=[];
    for(var i=0;i<csvPlayed.length;i++){
        if(csvPlayed[i]['tournament']==tournament ){
            csvData3.push(csvPlayed[i]);
        }
    }
     return csvData3;
}
http.createServer(async function (request, response) {
   
   var csvUpcoming=await readCsvFileUpcoming(); // save the csv of upcoming as variable
   var csvPlayed=await readCsvFilePlayed();// save the csv of played as variable
   var str=request.url;
   var teamID=str.split('team=').pop().split('/')[0]; //save the team id
   teamID=teamID.replace(/%20/g, " "); // make sure the spaces are spaces
   teamID=teamID.trim();

   var tournament=str.split('tournament=').pop().split('/')[0]; //save the tournament type
   tournament=tournament.replace(/%20/g, " ");
   tournament=tournament.trim();
  
   var status=str.split('status=').pop().split('/')[0]; // /save the status type
   status=status.replace(/%20/g, " ");
   status=status.trim();
   
   if (str.includes("/matchesByTeam/")){  // get matches by team both played and upcoming
        let matchesUpcoming = await getMatchesByTeamUpcoming(teamID,csvUpcoming);
        let matchesPlayed= await getMatchesByTeamPlayed(teamID,csvPlayed);
        let together= matchesUpcoming.concat(matchesPlayed);
       // console.log(together);
        jsonMatches = JSON.stringify(together);
        response.writeHead(200, { 'Content-Type': 'json' });
        response.end(jsonMatches, 'utf-8');
   } 
   else if (str.includes("/matchesByTeamByStatus/")){ // get matches by team  filtered by status played or upcoming 
        if(status=='upcoming'){ // status = upcoming
            let matchesUpcoming = await getMatchesByTeamUpcoming(teamID,csvUpcoming);
            jsonMatches = JSON.stringify(matchesUpcoming);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(jsonMatches, 'utf-8');
        }
        else if(status=='played'){ // status = played
            let matchesPlayed= await getMatchesByTeamPlayed(teamID,csvPlayed);
            jsonMatches = JSON.stringify(matchesPlayed);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(jsonMatches, 'utf-8');
        }
   }
   else if(str.includes("/matchesByTournament/")){ // get matches by type of tournament
        let matchesUpcoming = await getMatchesByTournamentUpcoming(tournament,csvUpcoming);
        let matchesPlayed= await getMatchesByTournamentPlayed(tournament,csvPlayed);
        let together= matchesUpcoming.concat(matchesPlayed);
        jsonMatches = JSON.stringify(together);
        response.writeHead(200, { 'Content-Type': 'json' });
        response.end(jsonMatches, 'utf-8');
   }
   else if(str.includes("/matchesByTournamentByStatus/")){ // get matches by type of tournament filtered by status played or upcoming
        if(status=='upcoming'){ // status = upcoming
            let matchesUpcoming = await getMatchesByTournamentUpcoming(tournament,csvUpcoming);
            jsonMatches = JSON.stringify(matchesUpcoming);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(jsonMatches, 'utf-8');
         }
        else if(status=='played'){ // status = played
            let matchesPlayed= await getMatchesByTournamentPlayed(tournament,csvPlayed);
            jsonMatches = JSON.stringify(matchesPlayed);
            response.writeHead(200, { 'Content-Type': 'json' });
            response.end(jsonMatches, 'utf-8');
        } 
   }
}).listen(8125); // the listen port
console.log('Server running at http://127.0.0.1:8125/');