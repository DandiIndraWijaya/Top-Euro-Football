
	document.addEventListener('DOMContentLoaded', function(){

		// SIDEBAR NAVIGATION
		var elems = document.querySelectorAll('.sidenav');
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
							
							// Muat konten halaman yang dipanggil 
							let url = event.target.getAttribute('href').substr(1);
							url = url.split("#")
							const page = url[1]
							loadPage(page);
						});
					});
				  });
		}


		// LOAD KONTEN HALAMAN
		const path = window.location.pathname;

		if(path === '/standings.html'){
          	getCompetitionStanding()

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
									console.log(clubs);
									content.innerHTML = data;

									const myFavClub = document.getElementById("my-favorite-clubs");

									myFavClub.innerHTML =  `
										${
											clubs.length > 0? clubs.map(club => 
												`
												<h6>My Favorite Clubs</h6>
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
														
													</center>`
											).join(" ")
											: 
											`<center>
												<h4 style="margin-top: 20%">You're not a fan of any clubs</h4>
											</center>`
										}
									</div>
									`;
									// Hapush dari Favorite Clubs
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




