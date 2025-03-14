function showTab() {
    const tabs = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const navItems = document.querySelectorAll(".nav-item"); 
    function activateTab(index) {
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        navItems.forEach(nav => {
            nav.style.backgroundColor = "";
            nav.style.color = ""; 
        });


        tabs[index].classList.add("active");
        tabContents[index].classList.add("active");

        navItems[index].style.backgroundColor = "#52C58B"; 
        navItems[index].style.color = "#ffffff";
    }

    let defaultIndex = [...tabs].findIndex(tab => tab.classList.contains("active"));
    if (defaultIndex === -1) defaultIndex = 0; 
    activateTab(defaultIndex);

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {
            activateTab(index);
        });
    });
}

function initializeUserCard() {
    const userCards = document.querySelectorAll(".user-list-card");

    if (userCards.length > 0) {
        userCards[0].classList.add("active-user-class");

        const firstUserCode = userCards[0].getAttribute("data-usercode");
        document.querySelector(".usercode").value = firstUserCode;
        fetchUserData(firstUserCode);
    }

    userCards.forEach(card => {
        card.addEventListener("click", function () {
            document.querySelectorAll(".user-list-card").forEach(card => {
                card.classList.remove("active-user-class");
            });

            this.classList.add("active-user-class");

            const userCode = this.getAttribute("data-usercode");
            document.querySelector(".usercode").value = userCode;
            fetchUserData(userCode);
        });
    });
}



function fetchUserData(userCode) {
    fetch(`/get_user_data/${userCode}/`)
        .then(response => response.json())
        .then(data => {
            document.querySelector(".user-fullname").textContent = data.fullname;
            document.querySelector(".user-username").textContent = data.username;
            document.querySelector(".user-contact").textContent = data.contact;
            document.querySelector(".user-gmail").textContent = data.email;
            document.querySelector(".user-password").textContent = data.pass;
            document.querySelector(".user-about").textContent = data.about ? data.about : "No data available!";

        })
        .catch(error => console.error("Error fetching user data:", error));
}

window.initializeUserCard = initializeUserCard;
window.showTab = showTab;


