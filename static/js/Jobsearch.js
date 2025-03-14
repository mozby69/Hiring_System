document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".jobdetails-container");
    const navbarOffset = navbar.offsetTop;

    window.addEventListener("scroll", function () {
        if (window.scrollY > navbarOffset) {
            navbar.classList.add("sticky-jobdetails-container");
        } 
        else {
            navbar.classList.remove("sticky-jobdetails-container");
        }

    });

    const tabs = document.querySelectorAll(".nav-link");
    const tabContents = document.querySelectorAll(".tab-content");
    const navItems = document.querySelectorAll(".nav-item");
    

    function activateTab(index) {
        tabs.forEach(t => t.classList.remove("active"));
        tabContents.forEach(content => content.classList.remove("active"));
        navItems.forEach(nav => {
            nav.style.borderBottom = "";
        });
    
        tabs[index].classList.add("active");
        tabContents[index].classList.add("active");
    
        navItems[index].style.borderBottom = "2px solid #27a064";
    
        localStorage.setItem("JobSeach-Active-tab", index);
    }
    
    let savedIndex = localStorage.getItem("JobSeach-Active-tab");
    let defaultIndex = savedIndex !== null ? parseInt(savedIndex) : 0;
    activateTab(defaultIndex);
    
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function () {
            activateTab(index);
        });
    });
    
    


// edit skills for user
    document.querySelectorAll(".close-btn-skill").forEach(button => {
        button.addEventListener("click", function () {
            let skillToRemove = this.dataset.skills;
            Swal.fire({
                title: `Remove ${skillToRemove}?`,
                text: "Are you sure you want to remove this skill?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, remove it!"
            }).then((result) => {
                if (result.isConfirmed) {
                var data ={
                    skill:skillToRemove,
                }
                PostReqHandler('/remove-skill/',data,function(response){
                    if (response.success) {
                        Swal.fire("Deleted!", "Skill has been removed.", "success")
                        .then(() => {
                            window.location.reload(); 
                        });
                    } else {
                        Swal.fire("Error", response.error, "error");
                    }
                });
            }
            });
        });
    });
// edit skills for user


// add skills for user
    document.querySelector(".add-skill-sets").addEventListener("click", function() {
        Swal.fire({
            title: "Enter a new skill",
            input: "text",
            inputPlaceholder: "e.g., Finance, Accounting, Sales, Development",
            showCancelButton: true,
            confirmButtonText: "Add Skill",
            cancelButtonText: "Cancel",
            preConfirm: (newSkill) => {
                if (!newSkill) {
                    Swal.showValidationMessage("Skill cannot be empty!");
                }
                return newSkill;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let newSkill = result.value;
                    var data ={
                        new_skill:newSkill,
                    }
                    PostReqHandler('/add-skill/',data,function(response){
                    if (response.success) {
                        Swal.fire("Success", "Skill added successfully!", "success").then((result) => {
                            window.location.reload()
                        });
                    } else {
                        Swal.fire("Error", response.error, "error");
                    }
                })
            }
        });
    });
// add skills for user



});



// Function to make elements editable and send updates to the backend
function makeEditable(elementId, fieldName) {
    const editableElement = document.getElementById(elementId);

    if (!editableElement) return;

    editableElement.addEventListener("dblclick", function () {
        this.setAttribute("contenteditable", "true");
        this.focus();
    });

    document.addEventListener("click", function (event) {
        if (event.target !== editableElement) {
            editableElement.setAttribute("contenteditable", "false");
        }
    });

    editableElement.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            this.setAttribute("contenteditable", "false");
            const updatedContent = this.innerText.trim();
            updateUserField(fieldName, updatedContent);
        }
    });
}

// Function to send data to Django backend
function updateUserField(fieldName, updatedContent) {
        var data ={
            value:updatedContent,
            field:fieldName
        }
    PostReqHandler('/update-user-details/',data,function(response){
        if (response.success) {
            Swal.fire("Success", "Edited Successfully", "success");
        } else {
            Swal.fire("Error", "Failed to update", "error");
        }
    });
}

// Apply the function to multiple elements
makeEditable("editable-about-paragraph", "AboutUser");
makeEditable("editable-address-paragraph", "UserAddress");




    // const burgerMenu = document.getElementById("burgerMenu");
    // const navTabs = document.getElementById("navTabs");

    // burgerMenu.addEventListener("click", function () {
    //     navTabs.classList.toggle("active");
    // });

    // // Close menu when clicking outside
    // document.addEventListener("click", function (event) {
    //     if (!navTabs.contains(event.target) && event.target !== burgerMenu) {
    //         navTabs.classList.remove("active");
    //     }
    // });






