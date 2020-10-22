
	document.addEventListener('DOMContentLoaded', function(){
		// Muat NavBar
		document.getElementById("nav").innerHTML = `
			<div class="nav-wrapper container">
			<a href="#" class="brand-logo" id="logo-container" style=""><img height="60" src="./images/logo.png" /></a>
			<a href="#" class="sidenav-trigger" data-target="nav-mobile" style="color: black;">&#9776;</a>
	
			<ul class="topnav right hide-on-med-and-down"></ul>
			<ul class="sidenav" style="background-color: #393e46;" id="nav-mobile"></ul>
		</div>
		`

		// Muat Footer
		document.getElementById("footer").innerHTML = `
			<div class="container" style="padding: 0px 10px 10px 10px;">
				<center>© 2020 Copyright | Built by Dandi Indra Wijaya</center>
			</div>
		`

		// SIDEBAR NAVIGATION
		let elems = document.querySelectorAll('.sidenav');
		M.Sidenav.init(elems);
		loadNav();
		
		function loadNav(){
			fetch('../nav.html')
				  .then(response => response.text())
				  .then(data => {
					  // Muat daftar tautan menu
					document.querySelectorAll(".topnav, .sidenav")
					.forEach(function(elm){
						elm.innerHTML = data;
					});
	
					// Daftarkan event listener untuk setiap tautan menu
					document.querySelectorAll('.sidenav a, .topnav a')
					.forEach(function(elm){
						elm.addEventListener('click', function(event){
							// Tutup sidenav
							var sidenav = document.querySelector('.sidenav');
							M.Sidenav.getInstance(sidenav).close();
							
							// Kode di bawah dijalankan jika berada di index.html
							let url = event.target.getAttribute('href').substr(1);
							url = url.split("#");
							const page = url[1];

							if(window.location.pathname == '/index.html'){
								loadPage(page);
							}
						});
					});
				  });
		}


		// LOAD KONTEN HALAMAN
		const path = window.location.pathname;

		if(path === '/standings.html'){
          	getCompetitionStandings()

		}else if(path === '/match.html'){
			getClubMatch()
		}else if(path === '/club_information.html'){
			getClubInformation()
		}else{
			let page = window.location.hash.substr(1);
			if(page == '') page = 'home';
			loadPage(page);
		}

		function loadPage(page)
		{
			const content = document.querySelector(".body-content");
			
				fetch('../pages/'+page+'.html')
				.then(response => {
					if(response.status === 200){
						getData(response.text());
						async function getData(responseData){
							let data = await responseData;

							if(page == "my_favorite_clubs"){
								getAllSavedFavoriteClubs().then(clubs =>{
									content.innerHTML = data;

									const myFavClub = document.getElementById("my-favorite-clubs");

									myFavClub.innerHTML =  `
										<h6 style="margin-top: 30px">My Favorite Clubs</h6>
										${
											clubs.length > 0? clubs.map(club => 
												`
												<div class="card" style="padding: 5px;">
													<center>
														<h4 style="text-decoration: underline;">${club.name}</h4>
														<img src="${club.crestUrl}" height="150" alt="favorite-club">
														<br>
															<div style="display: flex;  align-items: center;
															justify-content: center;">
																<a href="../club_information.html?id=${club.id}">
																	<button class="btn btn-club-detail" style="margin-right: 5px;">Club Information</button>
																</a>

																<button
																data-id="${club.id}" 
																class="btn btn-remove-favorite-club" 
																style="
																	margin-left: 5px; 
																	background-color: 
																	rgb(219, 20, 20); 
																	color: white"
																>
																	Remove
																</button>
															</div>
														
													</center>
												</div>`
											).join(" ")
											: 
											`<center>
												<h4 style="margin-top: 20%">You're not a fan of any clubs</h4>
											</center>`
										}
									</div>
									`;
									
									// Hapus klub dari obejctstore favorite-clubs
									const btnRemoveFavorite = document.querySelectorAll('.btn-remove-favorite-club');
									if(btnRemoveFavorite){
										for(let i = 0 ; i < btnRemoveFavorite.length ; i++){
											btnRemoveFavorite[i].addEventListener('click', function (event) {
												let id = btnRemoveFavorite[i].dataset.id;
												removeFromFavoriteClubs(parseInt(id));
												loadPage(page);
											})
										}
									}
								})
							}else{
								content.innerHTML = data;
							}
							
						}
						
					}
					else if(response.status === 404){
						content.innerHTML = "<p>Page not Found.</p>";
					}else{
						content.innerHTML = "<p>Can't Access this Page.</p>";
					}
				});
		}
		
	});




