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

	// Muat Sidebar Navigation
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
						
						// Kode di bawah dijalankan jika path berada di index.html
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


	// Muat konten halaman
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

						//Jika page adalah my_favorite_clubs jalankan blok kode dibawah untuk mendapatkan data dari object store favorite-clubs dalam indexedDB 
						if(page == "my_favorite_clubs"){
							getFavoriteClubsFromIndexedDB(data, loadPage, page);
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





