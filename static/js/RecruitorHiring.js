
function getCSRFToken() {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'))
        ?.split('=')[1];
}

function initializeDataTable() {
    const mastlisttable = $('.recruitmenttable').DataTable({
        serverSide: true,
        processing: true,
        searching: true,
        deferRender: true,
        ajax: {
            url: '/get_applications/',
            type: 'GET',
            data: function (d) {
                d.page = Math.ceil(d.start / d.length) + 1;
                d.pageSize = d.length;
                d.searchValue = d.search.value;
                d.sortColumnIndex = d.order.length > 0 ? d.order[0].column : 0;
                d.sortDirection = d.order.length > 0 ? d.order[0].dir : 'asc';
            },
            dataSrc: function (json) {
                if (json.error) {
                    console.error('Error loading data:', json.error);
                    return [];
                }
                return json.data;
            }
        },
        columns: [
            { data: 'ApplicantName' },
            { data: 'DateApplied' },
            { data: 'JobTitle' },
            { data: 'YearsofExp' },
            { data: 'ExpectedSalary' },
            { data: 'actions' },
        ]
        
    });


    const pendingtable = $('.pendingtable').DataTable({
        serverSide: true,
        processing: true,
        searching: true,
        deferRender: true,
        ajax: {
            url: '/get_pending_applications/',
            type: 'GET',
            data: function (d) {
                d.page = Math.ceil(d.start / d.length) + 1;
                d.pageSize = d.length;
                d.searchValue = d.search.value;
                d.sortColumnIndex = d.order.length > 0 ? d.order[0].column : 0;
                d.sortDirection = d.order.length > 0 ? d.order[0].dir : 'asc';
            },
            dataSrc: function (json) {
                if (json.error) {
                    console.error('Error loading data:', json.error);
                    return [];
                }
                return json.data;
            }
        },
        columns: [
            { data: 'ApplicantName' },
            { data: 'SchedApp' },
            { data: 'JobTitle' },
            { data: 'SchedBy' },
            { data: 'Status' },
            { data: 'actions' },
        ]
    });

    const finaltable = $('.finaltable').DataTable({
        serverSide: true,
        processing: true,
        searching: true,
        deferRender: true,
        ajax: {
            url: '/get_final_applications/',
            type: 'GET',
            data: function (d) {
                d.page = Math.ceil(d.start / d.length) + 1;
                d.pageSize = d.length;
                d.searchValue = d.search.value;
                d.sortColumnIndex = d.order.length > 0 ? d.order[0].column : 0;
                d.sortDirection = d.order.length > 0 ? d.order[0].dir : 'asc';
            },
            dataSrc: function (json) {
                if (json.error) {
                    console.error('Error loading data:', json.error);
                    return [];
                }
                return json.data;
            }
        },
        columns: [
            { data: 'ApplicantName' },
            { data: 'AssesmentDate' },
            {
                data: 'InitInterview',
                render: function (data, type, row) {
                    let style = 'background-color:#ABC8E9; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                    let text = 'In Progress';
            
                    if (row.InitInterview == true) {
                        style = 'background-color:#52C58B; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                        text = 'Done';
                    }
            
                    return '<span class="fw-bold" style="' + style + '">' + text + '</span>';
                }
            },
            
            { data: 'Exams' ,
                render: function (data, type, row) {
                    let style = 'background-color:#ABC8E9; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                    let text = 'In Progress';
            
                    if (row.Exams == true) {
                        style = 'background-color:#52C58B; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                        text = 'Done';
                    }
            
                    return '<span class="fw-bold" style="' + style + '">' + text + '</span>';
                }
            },

            { data: 'Cibi',
                render: function (data, type, row) {
                    let style = 'background-color:#ABC8E9; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                    let text = 'In Progress';
            
                    if (row.Cibi == true) {
                        style = 'background-color:#52C58B; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                        text = 'Done';
                    }
            
                    return '<span class="fw-bold" style="' + style + '">' + text + '</span>';
                }
             },

            { data: 'FinalInterview',
                render: function (data, type, row) {
                    let style = 'background-color:#ABC8E9; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                    let text = 'In Progress';
            
                    if (row.FinalInterview == true) {
                        style = 'background-color:#52C58B; color:#FFFFFF; cursor:pointer; padding-inline: 0.5rem; padding-block: 0.3rem; border-radius: 4px; display: inline-block;';
                        text = 'Done';
                    }
                    
                    return '<span class="fw-bold" style="' + style + '">' + text + '</span>';
                }
             },

            { data: 'actions' },
        ]
    });



    const rejectedtable = $('.rejectedtable').DataTable({
        serverSide: true,
        processing: true,
        searching: true,
        deferRender: true,
        ajax: {
            url: '/get_reject_applications/',
            type: 'GET',
            data: function (d) {
                d.page = Math.ceil(d.start / d.length) + 1;
                d.pageSize = d.length;
                d.searchValue = d.search.value;
                d.sortColumnIndex = d.order.length > 0 ? d.order[0].column : 0;
                d.sortDirection = d.order.length > 0 ? d.order[0].dir : 'asc';
            },
            dataSrc: function (json) {
                if (json.error) {
                    console.error('Error loading data:', json.error);
                    return [];
                }
                return json.data;
            }
        },
        columns: [
            { data: 'ApplicantName' },
            { data: 'DateRejected' },
            { data: 'ApplicationStage' },
            { data: 'Remarks' },
            { data: 'actions' },
        ]
    });



function deleteEmployee() {
        const modal = document.getElementById("delete-custom-modal");
        const applicantCode = modal.querySelector(".ApplicationCode").value;
        const activeTab = localStorage.getItem('selectedTable');
      
        fetch('/delete-employee/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken() 
            },
            body: JSON.stringify({ applicant_code: applicantCode,
                activeTab: activeTab
             })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Swal.fire({
                    title: "Reject Application",
                    text: "Application Rejected Successfully.",
                    icon: "success",
                    confirmButtonText: "OK"
                })
                if (activeTab === "newApplications"){
                    mastlisttable.ajax.reload()
                }
                else if (activeTab === "pendingApplications"){
                    pendingtable.ajax.reload()
                }
                else if (activeTab === "progressApplications"){
                    finaltable.ajax.reload()
                }
                else if (activeTab === "rejectApplications"){
                    rejectedtable.ajax.reload()
                }
                
            } else {
                Swal.fire({
                    title: "Reject Application",
                    text: "Application Rejection Failed.",
                    icon: "error",
                    confirmButtonText: "OK"
                })
            }
        })
        .catch(error => console.error("Error:", error));
    
        modal.style.display = "none";
    }
    
    window.deleteEmployee = deleteEmployee;



}





function refreshRecruitorHiringContent() {
    const activeTab = localStorage.getItem('activeTab');
    
    if (activeTab && activeTab.includes('recruitorhiring')) {
        loadContent(activeTab, true);
    }
}

function showTable(tableId) {
    localStorage.setItem('selectedTable', tableId);
    refreshRecruitorHiringContent(); 
    updateActiveButton(tableId);
}

function restoreSelectedTable() {
    let selectedTable = localStorage.getItem('selectedTable') || 'newApplications'; 

    document.getElementById('newApplications').style.display = 'none';
    document.getElementById('pendingApplications').style.display = 'none';
    document.getElementById('progressApplications').style.display = 'none';
    document.getElementById('rejectApplications').style.display = 'none';

    document.getElementById(selectedTable).style.display = 'block';
    
    updateActiveButton(selectedTable);
}

function updateActiveButton(activeTable) {

    document.querySelectorAll(".contents-btn").forEach(button => {
        button.style.backgroundColor = "";
    });


    const buttonColors = {
        "newApplications": "#52C58B",
        "pendingApplications": "#DDCD5A",
        "progressApplications": "#668EBC",
        "rejectApplications": "#D75757"
    };

    let button = document.querySelector(`button[onclick="showTable('${activeTable}')"]`);
    if (button) {
        button.style.backgroundColor = buttonColors[activeTable];
        button.style.color = '#FFFFFF';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    restoreSelectedTable();
});


function opentableModal(modalId,applicantCode = "", applicantName = "", jobTitle = "", yearsOfExp = "", expectedSalary = "") {
    let modal = document.getElementById(modalId);
      
    const modalHeading = modal.querySelector(".custom-modal-body h1");
    const activeTab = localStorage.getItem('selectedTable');
        
    if (!modal) return;

    if (modalId === "view-custom-modal") {
        modal.querySelector(".job-title-desc h1").innerText = jobTitle;
        modal.querySelector("input[placeholder='Enter your fullname']").value = applicantName;
        modal.querySelector("input[placeholder='Expected Salary']").value = expectedSalary;
        modal.querySelector("input[placeholder='Years of Experience']").value = yearsOfExp;
    } else if (modalId === "edit-custom-modal") {
        modal.querySelector(".job-title-desc h1").innerText = jobTitle;
        modal.querySelector(".ApplicationCode").value = applicantCode;
    }
    else if (modalId === "delete-custom-modal") {
        modal.querySelector(".job-title-desc h1").innerText = jobTitle;
        modal.querySelector(".ApplicationCode").value = applicantCode;
        if (activeTab === "rejectApplications"){
            modalHeading.textContent = "Are you sure you want to permanently remove this record?";
        }
        else{
            modalHeading.textContent =  "Are you sure you want to reject this application?";
        }

    }

    modal.style.display = "block";
}

function handleActionClick(event, modalId) {
    const target = event.currentTarget;
    const applicantCode = target.dataset.applicantcode || "";
    const applicantName = target.dataset.applicant || "";
    const jobTitle = target.dataset.jobtitle || "";
    const yearsOfExp = target.dataset.yearsofexp || "";
    const expectedSalary = target.dataset.expectedsalary || "";

    opentableModal(modalId,applicantCode, applicantName, jobTitle, yearsOfExp, expectedSalary);
}





window.showTable = showTable;
window.opentableModal = opentableModal;
window.handleActionClick = handleActionClick;



