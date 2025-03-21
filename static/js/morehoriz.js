function initializeDropdowns() {
    document.querySelectorAll(".more-btn").forEach(button => {
        button.addEventListener("click", function(event) {
            document.querySelectorAll(".dropdown-menu").forEach(menu => {
                if (menu !== this.nextElementSibling) {
                    menu.style.display = "none";
                }
            });

            let dropdown = this.nextElementSibling;
            dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";

            event.stopPropagation();
        });
    });

    document.addEventListener("click", function() {
        document.querySelectorAll(".dropdown-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });
}

function openjobtableModal(modalId, empCode = "") {
    let modal = document.getElementById(modalId);

    if (!modal) return;

    if (modalId === "addJob-custom-modal") {
        console.log("add job");
    } else if (modalId === "editJob-custom-modal") {
        populateEditModal(empCode);
    } else if (modalId === "deletejob-custom-modal") {
        populateDeleteModal(empCode);
        modal.querySelector(".custom-modal-content").style.width = '30rem';
    }
    modal.style.display = "block";
}

function handleJobActionClick(event, modalId) {
    const target = event.currentTarget;
    const empCode = target.getAttribute('data-emp-code');
    openjobtableModal(modalId, empCode);
}

// Function to populate the edit modal
function populateEditModal(jobCode) {
    fetch(`/get_job_details/${jobCode}/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const job = data.job;
                console.log('Job data received:', job);

                // Reset the form arrays to avoid duplicates
                const editForm = document.querySelector("#edit-job-form");
                editForm.benefits = [];
                editForm.qualifications = [];

                // Populate form fields
                document.querySelector("#edit-job-code").value = job.JobCode || '';
                document.querySelector("#edit-job-title").value = job.JobTitle || '';
                document.querySelector("#edit-job-desc").value = job.JobDesc || '';
                document.querySelector("#edit-emp-role").value = job.JobRole || '';
                document.querySelector("#edit-job-branch").value = job.BranchCode || '';

                // Province, City, Barangay Dropdowns
                const provinceDropdown = document.querySelector("#edit-job-province");
                const cityDropdown = document.querySelector("#edit-job-city");
                const barangayDropdown = document.querySelector("#edit-job-brgy");

                // Load Provinces and Set Selected Province
                fetch("https://psgc.gitlab.io/api/provinces")
                    .then(response => response.json())
                    .then(data => {
                        provinceDropdown.innerHTML = '<option value="">Select Province</option>';
                        let selectedProvinceCode = null;
                        data.forEach(province => {
                            let option = document.createElement("option");
                            option.value = province.code; // Use province CODE here
                            option.textContent = province.name;
                            if (province.name === job.JobProvince) {
                                option.selected = true;
                                selectedProvinceCode = province.code; // Get the correct province code
                            }
                            provinceDropdown.appendChild(option);
                        });

                        // Load cities after setting province
                        if (selectedProvinceCode) {
                            loadCities(selectedProvinceCode, job.JobCity);
                        }
                    });

                // Load Cities based on Province Selection
                provinceDropdown.addEventListener("change", function () {
                    loadCities(this.value, null);
                });

                function loadCities(provinceCode, selectedCity) {
                    if (!provinceCode) return;

                    fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`)
                        .then(response => response.json())
                        .then(data => {
                            cityDropdown.innerHTML = '<option value="">Select City</option>';
                            let selectedCityCode = null;
                            data.forEach(city => {
                                let option = document.createElement("option");
                                option.value = city.code; // Use city CODE here
                                option.textContent = city.name;
                                if (selectedCity && city.name === selectedCity) {
                                    option.selected = true;
                                    selectedCityCode = city.code; // Get the correct city code
                                }
                                cityDropdown.appendChild(option);
                            });

                            // Load barangays after setting city
                            if (selectedCityCode) {
                                loadBarangays(selectedCityCode, job.JobBrgy);
                            }
                        });
                }

                // Load Barangays based on City Selection
                cityDropdown.addEventListener("change", function () {
                    loadBarangays(this.value, null);
                });

                function loadBarangays(cityCode, selectedBarangay) {
                    if (!cityCode) return;

                    fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`)
                        .then(response => response.json())
                        .then(data => {
                            barangayDropdown.innerHTML = '<option value="">Select Barangay</option>';
                            data.forEach(barangay => {
                                let option = document.createElement("option");
                                option.value = barangay.code; // Use barangay CODE here
                                option.textContent = barangay.name;
                                if (selectedBarangay && barangay.name === selectedBarangay) {
                                    option.selected = true;
                                }
                                barangayDropdown.appendChild(option);
                            });
                        });
                }

                // Handle employment types
                const employmentButtons = document.querySelectorAll("#edit-job-benefits .employment-type-btn");
                employmentButtons.forEach(btn => {
                    btn.classList.remove('selected');
                    if (job.JobTypes && job.JobTypes.includes(btn.getAttribute('data-type'))) {
                        btn.classList.add('selected');
                    }
                });

                // Populate benefits
                const benefitList = document.querySelector("#edit-benefit-list");
                benefitList.innerHTML = '';
                let benefits = job.JobBenefits || [];
                if (typeof benefits === 'string') {
                    try {
                        benefits = JSON.parse(benefits.replace(/'/g, '"'));
                    } catch (e) {
                        benefits = benefits.split(',').map(item => item.trim());
                    }
                }
                if (!Array.isArray(benefits)) benefits = [benefits];
                benefits.forEach(benefit => {
                    if (benefit && typeof benefit === 'string' && benefit.trim().length > 0) {
                        const li = createListItemWithDelete(benefit.trim(), benefitList, 'benefits', true);
                        benefitList.appendChild(li);
                    }
                });

                // Populate qualifications
                const qualList = document.querySelector("#edit-qualification-list");
                qualList.innerHTML = '';
                let qualifications = job.JobQual || [];
                if (typeof qualifications === 'string') {
                    try {
                        qualifications = JSON.parse(qualifications.replace(/'/g, '"'));
                    } catch (e) {
                        qualifications = qualifications.split(',').map(item => item.trim());
                    }
                }
                if (!Array.isArray(qualifications)) qualifications = [qualifications];
                qualifications.forEach(qual => {
                    if (qual && typeof qual === 'string' && qual.trim().length > 0) {
                        const li = createListItemWithDelete(qual.trim(), qualList, 'qualifications', true);
                        qualList.appendChild(li);
                    }
                });

                // Set up event listeners for adding new benefits and qualifications in edit modal
                setupEditModalEventListeners();
            } else {
                console.error('Failed to fetch job details:', data.error);
            }
        })
        .catch(error => console.error('Error fetching job details:', error));
}



// Helper function to create list items with delete buttons
function createListItemWithDelete(text, list, type, isInitialPopulation = false) {
    const li = document.createElement('li');
    li.classList.add('list-item-with-delete');

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    li.appendChild(textSpan);

    const deleteButton = document.createElement('span');
    deleteButton.textContent = '×';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function() {
        li.remove();
        const form = document.querySelector("#edit-job-form");
        if (!form[type]) form[type] = [];
        const index = form[type].indexOf(text);
        if (index > -1) form[type].splice(index, 1);
    });
    li.appendChild(deleteButton);

    // Only add to the form array if this is not initial population
    if (!isInitialPopulation) {
        const form = document.querySelector("#edit-job-form");
        if (!form[type]) form[type] = [];
        form[type].push(text);
    } else {
        // For initial population, ensure the item is in the array exactly once
        const form = document.querySelector("#edit-job-form");
        if (!form[type]) form[type] = [];
        if (!form[type].includes(text)) {
            form[type].push(text);
        }
    }

    return li;
}

// Function to populate the delete modal with job details
function populateDeleteModal(jobCode) {
    fetch(`/get_job_details/${jobCode}/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const job = data.job;
                document.querySelector(".JobCode").value = job.JobCode;
                document.getElementById("delete-job-title").textContent = job.JobTitle || 'N/A';
                document.getElementById("delete-job-branch").textContent = job.BranchCode || 'N/A';
    
            } else {
                console.error('Failed to fetch job details for deletion:', data.error);
            }
        })
        .catch(error => console.error('Error fetching job details for deletion:', error));
}

// Function to handle job deletion
function deleteJob() {
    const jobCode = document.querySelector(".JobCode").value;

    if (!jobCode) {
        console.error('No job code found for deletion');
        return;
    }

    // Directly proceed with deletion since the modal already confirms
    fetch(`/delete_job/${jobCode}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Ensure CSRF token is included
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            Swal.fire(
                'Deleted!',
                'The job has been deleted.',
                'success'
            ).then(() => {
                closetableModal(); // Close the modal
                window.location.reload(); // Reload the page to reflect changes
            });
        } else {
            Swal.fire(
                'Error!',
                data.error || 'Failed to delete the job.',
                'error'
            );
        }
    })
    .catch(error => {
        console.error('Error deleting job:', error);
        Swal.fire(
            'Error!',
            'An error occurred while deleting the job.',
            'error'
        );
    });
}

// Helper function to get CSRF token (required for DELETE request)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setupEditModalEventListeners() {
    const editBenefitIcon = document.querySelector("#editJob-custom-modal #edit-add-benefit-icon");
    const editQualificationIcon = document.querySelector("#editJob-custom-modal #edit-add-qualification-icon");
    const benefitList = document.querySelector("#editJob-custom-modal #edit-benefit-list");
    const qualificationList = document.querySelector("#editJob-custom-modal #edit-qualification-list");

    // Handle adding job benefits in edit modal
    if (editBenefitIcon) {
        editBenefitIcon.addEventListener('click', function() {
            Swal.fire({
                title: 'Add Job Benefit',
                input: 'text',
                inputPlaceholder: 'Enter job benefit',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter a job benefit!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const li = createListItemWithDelete(result.value, benefitList, 'benefits');
                    benefitList.appendChild(li);
                }
            });
        });
    } else {
        console.log("");
    }

    // Handle adding job qualifications in edit modal
    if (editQualificationIcon) {
        editQualificationIcon.addEventListener('click', function() {
            Swal.fire({
                title: 'Add Job Qualification',
                input: 'text',
                inputPlaceholder: 'Enter job qualification',
                showCancelButton: true,
                confirmButtonText: 'Save',
                cancelButtonText: 'Cancel',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter a job qualification!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const li = createListItemWithDelete(result.value, qualificationList, 'qualifications');
                    qualificationList.appendChild(li);
                }
            });
        });
    } else {
        console.log("");
    }
}

window.initializeDropdowns = initializeDropdowns;
window.handleJobActionClick = handleJobActionClick;
window.closetableModal = function() { 
    document.querySelectorAll('.custom-modal').forEach(modal => {
        modal.style.display = 'none';
    });
};