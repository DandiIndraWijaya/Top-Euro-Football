
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
							content.innerHTML = data;
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




