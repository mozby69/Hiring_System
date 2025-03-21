
document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a.ajax-link");
    const mainContent = document.getElementById("main-content");
    const activeTab = localStorage.getItem('activeTab');

    const loadContent = (url) => {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML = html;

                window.scrollTo({
                    top:0,
                    behavior:"smooth"
                });


                if (url.includes('recruitorhiring')) {
                    initializeDataTable();
                    restoreSelectedTable();
                }
                if (url.includes('joblisting')) {
                    initializeDropdowns();
                    job();
                    api_jobLocation();
                }
                if (url.includes('facemetrics')) {
                    console.log("dasdsdasa")
                }
                if (url.includes('useracc')) {
                    initializeUserCard();
                    initializeDropdowns();
                    showTab();
                }

            })
            .catch(error => console.error("Error loading content:", error));
    };


    const setActiveTab = (url) => {
        sidebarLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute('data-url') === url) {
                link.classList.add("active");
            }
        });
    };


    if (activeTab) {
        setActiveTab(activeTab);
        loadContent(activeTab);
    } else {
        setActiveTab(sidebarLinks[0].getAttribute('data-url'));
        loadContent(sidebarLinks[0].getAttribute('data-url'));
    }

    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const url = this.getAttribute("data-url");

            setActiveTab(url);
            localStorage.setItem('activeTab', url);

            loadContent(url);
        });
    });
    window.loadContent = loadContent;

});


function closetableModal() {
    document.querySelectorAll(".custom-modal").forEach(modal => {
        modal.style.display = "none";
    });
}

window.closetableModal = closetableModal;

window.onclick = function(event) {
    document.querySelectorAll(".custom-modal").forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};


document.getElementById("logoutBtn").addEventListener("click", function(event) {
    event.preventDefault(); 

    Swal.fire({
        title: "Are you sure?",
        text: "You will be logged out of your account.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, log me out!"
    }).then((result) => {
        if (result.isConfirmed) {
            PostReqHandler('/logout/',null,function(response){
                if (response.success) {
                    Swal.fire("Logged out!", response.message, "success").then(() => {
                        window.location.href = "/";
                    });
                } else {
                    Swal.fire("Error!", response.message, "error");
                }
            })
        }
    });
});


function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        document.cookie.split(";").forEach(cookie => {
            let trimmedCookie = cookie.trim();
            if (trimmedCookie.startsWith("csrftoken=")) {
                cookieValue = trimmedCookie.substring("csrftoken=".length, trimmedCookie.length);
            }
        });
    }
    return cookieValue;
}




