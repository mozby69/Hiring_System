function openModal() {
    document.getElementById("custom-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("custom-modal").style.display = "none";
}


window.onclick = function(event) {
    let modal = document.getElementById("custom-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

