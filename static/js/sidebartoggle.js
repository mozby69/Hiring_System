const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')
const General = document.getElementById('general')
const General2 = document.getElementById('general2')
const General3 = document.getElementById('general3')

function toggleSidebar(){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
    
 
    if(sidebar.classList.contains('close')){
        General.style.display = "none"
        General2.style.display = "none"
        General3.style.display = "none"
    }
    else{
        General.style.display = "block"
        General2.style.display = "block"
        General3.style.display = "block"
        
    }


}
   