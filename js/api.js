let base_url = "https://api.football-data.org/v2/";
const content = document.querySelector(".body-content");

// Blok kode yang akan di panggil jika fetch berhasil
const status = response => {
    if (response.status !== 200) {
      console.log("Error : " + response.status);
      // Method reject() akan membuat blok catch terpanggil
      return Promise.reject(new Error(response.statusText));
    } else {
      // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
      return Promise.resolve(response);
    }
  }
  
  // Blok kode untuk memparsing json menjadi array JavaScript
  const json = response => {
    return response.json();
  }
  
  // Blok kode untuk meng-handle kesalahan di blok catch
  const error = () => {
    // Parameter error berasal dari Promise.reject()
    console.log("Error : " + error);
  }

const getCompetitionStanding = () => {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    
    let showData = (data, id) => {
        
            const standings = data.standings[0].table;
            data.id = id;

            let logo = '';
            if(id === '2021'){
                logo = '../images/premiere_league_emblem.jpg';
            }
            
            content.innerHTML = `
                <center><img src="${logo}" widt="100" height="100" class="club-standing-logo" /></center>
                <h5>Standing <span style="font-size: 10pt;">${data.status}</span> </h5> 
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
    }
    return new Promise(function(resolve, reject) {

        if(navigator.onLine){
            fetch(`${base_url}competitions/${idParam}/standings`, {
                headers: {
                    "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
                }
            })
              .then(status)
              .then(json)
              .then(function(data) {
                data.status = "The data is up to date"
                showData(data, idParam);
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
              });
        }
        else {
          caches.match(`${base_url}competitions/${idParam}/standings`)
          .then(response => {
            if (response) {
              response.json().then(function(data) {
                data.status = "The data isn't Updated because you're offline"
                showData(data, idParam)
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
              });
            }else{
                content.innerHTML = `
                <center>
                    <h3 style="margin-top: 20%">No Data & You're Offline</h3>
                    <h5>Connect your device to internet to receive data</h5>
                </center>`
            }
          });
        }
       
    });
}

const getClubMatch = () => {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");
    let logoParam = urlParams.get("logo");

    let showData = (data, logo, id) =>{
        
        const schedules = data.matches;
        content.innerHTML = `
            <br>
            <center>
                <img src="${logo}" width="100" height="100" />
                <br>
                <a href="./club_information.html?id=${id}">
                    <button class="btn btn-club-information">Club Information</button>
                </a>
            </center>
            <h5>Match Schedules</h5>
            ${
                schedules.map(schedule => {
                    let date = new Date(schedule.utcDate)
                    return `
                        
                        <div class="card schedule">
                            <div class="row">
                                <div class="col s12">
                                    <center>
                                        <h6 style="color: #393e46">${schedule.competition.name}</h6>
                                    <tr>
                                        <td><h5>${schedule.homeTeam.name} <span style="font-size: 10pt">(Home)</span></h5></td>
                                        <td><h5>vs</h5></td>
                                        <td><h5>${schedule.awayTeam.name} <span style="font-size: 10pt">(Away)</span></h5></td>
                                    </tr>
                                        <span style="color: #393e46">${date.toLocaleString("id-ID")}</span> 
                                    </center>
                                </div>
                            </div>
                        </div>
                        `
                    }
                ).join(" ")
            }`;
    }
    console.log('dd')
    return new Promise(function(resolve, reject) {

        if(navigator.onLine){
            fetch(`https://api.football-data.org/v2/teams/${idParam}/matches?status=SCHEDULED`, {
                headers: {
                    "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
                }
            })
            .then(status)
            .then(json)
            .then(function(data) {
                showData(data, logoParam ,idParam)
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
            });
        }else{
            caches.match(`https://api.football-data.org/v2/teams/${idParam}/matches?status=SCHEDULED`)
            .then(response => {
                if (response) {
                    response.json().then(function(data) {
                        showData(data, logoParam ,idParam)
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }else{
                    content.innerHTML = `
                    <center>
                        <h3 style="margin-top: 20%">No Data & You're Offline</h3>
                        <h5>Connect your device to internet to receive data</h5>
                    </center>`
                }
            });
        }
    });
}

const getClubInformation = () => {
    // Ambil nilai query parameter (?id=)
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    let showData = (data, id, check) => {
        content.innerHTML = `
            <br>
            <div class="card" style="padding: 5px;">
                
                <center>
                    <h5 style="text-decoration: underline">${data.name}</h5>
                    <h6>Since ${data.founded}</h6>
                    ${check ? 
                        `<span style='color: #00adb5'>You're a fan of this club</span>
                        <br>
                        <button class="btn-remove-favorite">Not a fan anymore? ( click! )</button>` : 
                        `<button class="btn btn-save-favorite">Add to My Favorite Clubs</button>`
                    }
                    <br>
                        <a href="./match.html?id=${id}&logo=${data.crestUrl}"> 
                            <button class="btn btn-schedules">Match Schedules</button>
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

        
        const btnFavorite = document.querySelector(".btn-save-favorite");
        const btnRemoveFavorite = document.querySelector(".btn-remove-favorite");
        //  Simpan ke Favorite Clubs
        if(btnFavorite){
            btnFavorite.addEventListener('click', () =>{
                showData(data, id, true);
                saveToFavoriteClubs(data)
            });
        }

        // Hapush dari Favorite Clubs
        if(btnRemoveFavorite){
            btnRemoveFavorite.addEventListener('click', () => {
                showData(data, id, false);
                removeFromFavoriteClubs(parseInt(id))
            })
        }

    }
    return new Promise(function(resolve, reject) {
        
        if(navigator.onLine){
            fetch(`${base_url}teams/${idParam}`, {
                headers: {
                    "X-Auth-Token" : "d6a0462a40b74b29b622919e71c7b069"
                }
            })
              .then(status)
              .then(json)
              .then(function(data) {

                // Cek apakah club/tim adalah club favorit
                checkFavoriteClub(parseInt(idParam)).then(club => {
                    if(club){
                        // Jika iya
                        showData(data, idParam, true)
                    }else{
                        // Jika tidak
                        showData(data, idParam, false)
                    }
                });
                // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                resolve(data);
            });
        }else{
            caches.match(`${base_url}teams/${idParam}`).then(function(response) {
                if (response) {
                  response.json().then(function(data) {
                      // Cek apakah club/tim adalah club favorit
                    checkFavoriteClub(parseInt(idParam)).then(club => {
                        if(club){
                            // Jika iya 
                            showData(data, idParam, true)
                        }else{
                            // Jika tidak
                            showData(data, idParam, false)
                        }
                    });
                    // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                    resolve(data);
                  });
                }else{
                    content.innerHTML = `
                    <center>
                        <h3 style="margin-top: 20%">No Data & You're Offline</h3>
                        <h5>Connect your device to internet to receive data</h5>
                    </center>`
                }
              });
        }
    });
}



