function openModal() {
    document.getElementById("login-custom-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("login-custom-modal").style.display = "none";
}

window.onclick = function(event) {
    let modal = document.getElementById("login-custom-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}


document.getElementById("login-btn").addEventListener("click", function(event) {
    event.preventDefault();

    let data = {
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value
    };


    PostReqHandler('/login/',data,function(response){
        if (response.success) {
            Swal.fire({
                title: "Login Successfully",
                text: response.message,
                icon: "success",
            }).then(() => {
                window.location.href = "/Jobsearch/";  
            });            
            
        } else {
            Swal.fire({
                title: "Login Failed",
                text:  response.message,
                icon: "error",
            })
        }
    });
});

