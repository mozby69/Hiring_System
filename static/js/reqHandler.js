function getCSRFToken(){
    var cookieValue = null;
    var cookies = document.cookie ? document.cookie.split(';') : [];
    for(var i = 0; i < cookies.length; i++){
        var cookie = cookies[i].trim();
        if(cookie.startsWith('csrftoken=')){
            cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length));
            break;
        }
    }
    return cookieValue;
}



function PostReqHandler(url, data = null, successCallback) {
    const fetchOptions = {
        method: "POST",
        headers: {
            "X-CSRFToken": getCSRFToken(), 
            "Content-Type": "application/json"
        }
    };

    if (data) {
        fetchOptions.body = JSON.stringify(data);
    }

    fetch(url, fetchOptions)
    .then(response => response.json())
    .then(data => {
        if (successCallback) {
            successCallback(data); 
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire("Error!", "Something went wrong!!!!", "error");
    });
}
