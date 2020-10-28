let logout = async () => {
	axios
		.post('/logout', {})
		.then(function(response) {
			window.location.replace('/login');
		})
		.catch(function(error) {
			console.log(error);
		});
};


$("#logout").on("click",()=>{
	logout()
})
