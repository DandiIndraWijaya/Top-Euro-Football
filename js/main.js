import { getCompetitionStanding, getClubMatch, getClubInformation } from './api.js';

const main = () => {
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
							page = event.target.getAttribute('href').substr(1);
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
			if(page === 'klasemen'){
				console.log('klasemen')
			}else{
				fetch('../pages/'+page+'.html')
				.then(response => {
					if(response.status === 200){
						getData(response.text());
						async function getData(responseData){
							let data = await responseData;
							content.innerHTML = data;
						}
					}
					else if(response.status === 404){
						content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
					}else{
						content.innerHTML = "<p>Halaman tidak dapat diakses.</p>";
					}
				});
			}
		}


		// INDEXEDDB
		
	});
}


export default main;

