document.querySelector("#sign-up-form").addEventListener('submit',function(event){

    event.stopPropagation();
    event.preventDefault();


   var fullname = document.querySelector("#fulname-val").value;
   var username = document.querySelector("#username-val").value;
   var password = document.querySelector("#password-val").value;
   var contact = document.querySelector("#contact-val").value;
   var emailadd = document.querySelector("#email-val").value;

   var data ={
    fullname:fullname,
    username:username,
    password:password,
    contact:contact,
    emailadd:emailadd
   }

   PostReqHandler('/create_customer/',data,function(response){
        if(response.success){
            swal({
                title: "Account Created",
                text: "You can now login to the site",
                icon: "success",
            }).then(()=>{
                window.location.reload();
            }

            );
        }
        else if (response.success == false){
            swal({
                title: "Duplicate Username",
                text: "Username is already taken",
                icon: "error",
            });
        }
        else{
            swal({
                title: "Incorrect Input",
                text: "Please check your input data",
                icon: "error",
            });
        }
   });

});


function toggleDisplay(button) {
    const elementsToShow = document.querySelectorAll(button.dataset.show || '');
    const elementsToHide = document.querySelectorAll(button.dataset.hide || '');

    elementsToShow.forEach(el => el.style.display = 'block');
    elementsToHide.forEach(el => el.style.display = 'none');
}

document.querySelectorAll('[data-show], [data-hide]').forEach(button => {
    button.addEventListener('click', function() {
        toggleDisplay(button);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const links = {
        ".explore-link": "#about-section",
        ".about-sect-link": "#about-section",
        ".service-sect-link": "#service-section",
        ".main-section": "#main-section",
        ".contact-section-link": "#contact-section"
    };

    Object.entries(links).forEach(([selector, target]) => {
        const link = document.querySelector(selector);
        if (link) {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                document.querySelector(target).scrollIntoView({
                    behavior: "smooth"
                });
            });
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".nav");
    const navbarOffset = navbar.offsetTop;

    window.addEventListener("scroll", function () {
        if (window.scrollY > navbarOffset) {
            navbar.classList.add("sticky-nav");
        } 
        else {
            navbar.classList.remove("sticky-nav");
        }

    });

});
