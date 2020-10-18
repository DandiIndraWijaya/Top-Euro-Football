import { dbPromised, saveClubs, saveToFavorites, saveCompetitionStanding, saveSchedules } from './db.js';


const getCompetitionStanding = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    
    fetch(`https://api.football-data.org/v2/competitions/${idParam}/standings`, {
        headers: {
            "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
        }
    })
    .then(response => response.json())
    .then(data => {
        const content = document.querySelector(".body-content");
        const standings = data.standings[0].table;
        data.id = idParam;

        // Cek apakah data klasemen ada di indexedDB
        const checkDB = id => {
            return new Promise(function(resolve, reject) {
              dbPromised
                .then(function(db) {
                  var tx = db.transaction("standings", "readonly");
                  var store = tx.objectStore("standings");
                  return store.get(id);
                })
                .then(function(schedule) {
                  if(schedule){
                      return
                  }else{
                    // Simpan data jika belum ada data klasemen di indexDB
                    saveCompetitionStanding(data);
                  }
                });
            });
          }

        checkDB(idParam)

        let logo = '';
        if(idParam === '2021'){
            logo = '../images/premiere_league_emblem.jpg';
        }
        
        content.innerHTML = `
        <div class="standing-header">
            
            <div><h5 class="klasemen-title">Klasemen</h5></div>
            <div><img src="${logo}" widt="100" height="100" class="club-standing-logo" /></div>
        </div>
        <table class="striped">
        <thead>
          <tr>
            <th></th>
            <th></th>
              <th>Klub</th>
              <th>M</th>
              <th>M</th>
              <th>S</th>
              <th>K</th>
              <th>GM</th>
              <th>GA</th>
              <th>SG</th>
              <th>Poin</th>
          </tr>
        </thead>

        <tbody>
            ${
                standings.map(club => `
                        <tr>
                            <td>${club.position}</td>
                            <td><img src="${club.team.crestUrl}"  height="15"  /></td>
                            <td> 
                                <a href="./club_information.html?id=${club.team.id}" >
                                     <span class="club-name-table">${club.team.name}</span>
                                </a>
                            </td>
                            <td>${club.playedGames}</td>
                            <td>${club.won}</td>
                            <td>${club.draw}</td>
                            <td>${club.lost}</td>
                            <td>${club.goalsFor}</td>
                            <td>${club.goalsAgainst}</td>
                            <td>${club.goalDifference}</td>
                            <td>${club.points}</td>
                        </tr>
                    `
                ).join(" ")
            }
        </tbody>
      </table>
        `
    })
}

const getClubMatch = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    let logoParam = urlParams.get("logo");

    
    fetch(`https://api.football-data.org/v2/teams/${idParam}/matches?status=SCHEDULED`, {
        headers: {
            "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
        }
    })
    .then(response => response.json())
    .then(data => {
        data.id = idParam;
        // Cek apakah data jadwal ada di indexedDB
        const checkDB = id => {
            return new Promise(function(resolve, reject) {
              dbPromised
                .then(function(db) {
                  var tx = db.transaction("schedules", "readonly");
                  var store = tx.objectStore("schedules");
                  return store.get(id);
                })
                .then(function(schedule) {
                  if(schedule){
                      return
                  }else{
                    // Simpan data jika belum ada jadwal di indexDB
                    saveSchedules(data)
                  }
                });
            });
          }

        checkDB(idParam)
        
        const content = document.querySelector(".body-content");
        const schedules = data.matches;
        content.innerHTML = `
            <br>
            <center>
                <img src="${logoParam}" width="100" height="100" />
                <br>
                <a href="./club_information.html?id=${idParam}">
                    <button id="btn-club-information">Club Information</button>
                </a>
            </center>
            ${
                schedules.map(schedule => {
                    let date = new Date(schedule.utcDate)
                    return `
                        
                        <div class="card schedule">
                            <div class="row">
                                <div class="col s12" style="color: #393e46">
                                    ${date.toLocaleString("id-ID")}
                                </div>
                                <div class="col s12">
                                    <center>
                                    <tr>
                                        <td><h5>${schedule.homeTeam.name} <span style="font-size: 10pt">(Home)</span></h5></td>
                                        <td><h5>vs</h5></td>
                                        <td><h5>${schedule.awayTeam.name} <span style="font-size: 10pt">(Away)</span></h5></td>
                                    </tr>
                                        <h6 style="color: #393e46">${schedule.competition.name}</h6>
                                    </center>
                                </div>
                            </div>
                        </div>
                        `
                    }
                ).join(" ")
            }`;
    })
}

const getClubInformation = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    fetch(`https://api.football-data.org/v2/teams/${idParam}`, {
        headers: {
            "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
        }
    })
    .then(response => response.json())
    .then(data => {
        const content = document.querySelector(".body-content");
        data.id = idParam

        // Cek apakah data tim ada di indexedDB
        const checkDB = id => {
            return new Promise(function(resolve, reject) {
              dbPromised
                .then(function(db) {
                  var tx = db.transaction("clubs", "readonly");
                  var store = tx.objectStore("clubs");
                  return store.get(id);
                })
                .then(function(schedule) {
                  if(schedule){
                      return
                  }else{
                    // Simpan data jika belum ada data tim di indexDB
                    saveClubs(data)
                  }
                });
            });
          }

        checkDB(idParam)
        
        content.innerHTML = `
            <br>
            <div class="card" style="padding: 5px;">
                
                <center>
                    <h5 style="text-decoration: underline">${data.name}</h5>
                    <h6>Since ${data.founded}</h6>

                    <button id="btn-save-favorite">Save to My Favorite</button>
                    <br>
                        <a href="./match.html?id=${idParam}&logo=${data.crestUrl}"> 
                            <button id="btn-schedules">Match Schedules</button>
                        </a>
                    <br>
                    <br>
                    <img src="${data.crestUrl}"  height="200" >
                    <h6>${data.area.name}</h6>
                    <h6>${data.address}</h6>
                    <h6><a href="${data.website}">${data.website}</a></h6>
                    <br>
                    Competition :
                    ${
                        data.activeCompetitions.map(competition => `
                            ${competition.name}
                        `)
                    }
                    <br><br>
                    <h5>Squad</h5>
                </center>
                
                <table class="centered striped">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Country</th>
                    </tr>
                    </thead>

                    <tbody>
                        ${
                            data.squad.map(player => `
                                    <tr>
                                        <td>${player.name}</td>
                                        <td>${player.position}</td>
                                        <td>${player.nationality}</td>
                                    </tr>
                                `
                            ).join(" ")
                        }
                    </tbody>
                </table>

            </div>
        `;

        // SAVE CLUB TO MY FAVORITES
        const btnFavorite = document.querySelector("#btn-save-favorite");
        const btnSchedules = document.querySelector('#btn-schedules');
        
		btnFavorite.addEventListener('click', () =>{
            saveToFavorites(data)
        });
        
        btnSchedules.addEventListener('click', () => {

        })
    })
}

export {
    getCompetitionStanding,
    getClubMatch,
    getClubInformation
}