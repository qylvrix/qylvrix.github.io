window.addEventListener("DOMContentLoaded", () => {
  fetch("/COMPONENTS/navbar.html")
    .then(res => res.text())
    .then(data => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = data;
      
      // insert navbar at the top
      document.body.insertBefore(wrapper, document.body.firstChild);
      
      // now process links
      const currentPage = window.location.pathname.split("/").pop(); // e.g. tutorials.html
      const links = wrapper.querySelectorAll(".sidebar ul li a");
      
      links.forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.includes(currentPage) && currentPage !== "") {
          // hide current page link
          link.parentElement.style.display = "none";
          
          // if we're not on home page, add Home link
          if (currentPage !== "index.html") {
            const homeItem = document.createElement("li");
            homeItem.innerHTML = `
              <a href="/index.html">
                <img src="/icons/home.svg" class="nav-icon" alt="Home icon">Home
              </a>`;
            wrapper.querySelector(".sidebar ul").prepend(homeItem);
          }
        }
      });
    })
    .catch(err => console.error("Navbar load failed:", err));
});