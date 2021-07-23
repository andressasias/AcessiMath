function main() {
	const burgerMenu = document.getElementById("burger")
	const navbarMenu = document.getElementById("menu")
	
	// Responsive Navbar Toggle
	burgerMenu.addEventListener("click", function () {
		navbarMenu.classList.toggle("active")
		burgerMenu.classList.toggle("active")
	})
}

window.addEventListener('onDOMContentLoaded', main)

