function main() {
	const burgerMenu = document.getElementById("burger")
	const navbarMenu = document.getElementById("menu")
	
	console.log("teste")
	// Responsive Navbar Toggle
	burgerMenu.addEventListener("click", function () {
		navbarMenu.classList.toggle("active")
		burgerMenu.classList.toggle("active")
	})
	console.log(1)
}

window.addEventListener('onDOMContentLoaded', main)

