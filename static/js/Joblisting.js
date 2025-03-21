function job() {
    const form = document.querySelector("#add-job-form");
    const editForm = document.querySelector("#edit-job-form");
    const employmentButtons = document.querySelectorAll(".employment-type-btn");
    const addBenefitIcon = document.querySelector("#add-benefit-icon");
    const benefitList = document.querySelector("#benefit-list");
    const addQualificationIcon = document.querySelector("#add-qualification-icon");
    const qualificationList = document.querySelector("#qualification-list");

    // Handle button clicks for employment type (for both add and edit forms)
    employmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('selected'); // Toggle green color
        });
    });

    // Helper function for creating list items (used for both add and edit forms)
    function createListItem(text, list, type) {
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
            const form = list.closest('form');
            if (!form[type]) form[type] = [];
            const index = form[type].indexOf(text);
            if (index > -1) form[type].splice(index, 1);
        });
        li.appendChild(deleteButton);

        const form = list.closest('form');
        if (!form[type]) form[type] = [];
        if (!form[type].includes(text)) { // Prevent duplicates
            form[type].push(text);
        }

        return li;
    }

    // Handle adding job benefits (for Add Job form)
    if (addBenefitIcon) {
        addBenefitIcon.addEventListener('click', function() {
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
                    const li = createListItem(result.value, benefitList, 'benefits');
                    benefitList.appendChild(li);
                }
            });
        });
    } else {
        console.log("benefit modal not found");
    }

    // Handle adding job qualifications (for Add Job form)
    if (addQualificationIcon) {
        addQualificationIcon.addEventListener('click', function() {
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
                    const li = createListItem(result.value, qualificationList, 'qualifications');
                    qualificationList.appendChild(li);
                }
            });
        });
    } else {
        console.log("qualification modal not found");
    }

    // Add form submission (for adding new jobs)
if (form) {
    form.addEventListener('submit', function(event) {
        event.stopPropagation();
        event.preventDefault();

        const jobTitle = document.querySelector("#job-title").value;
        const jobBranch = document.querySelector("#job-branch").value;

        // Get selected province name instead of code
        const jobProvinceSelect = document.querySelector("#job-province");
        const jobProvince = jobProvinceSelect.options[jobProvinceSelect.selectedIndex].text;

        // Get selected city name instead of code
        const jobCitySelect = document.querySelector("#job-city");
        const jobCity = jobCitySelect.options[jobCitySelect.selectedIndex].text;

        // Get selected barangay name instead of code
        const jobBrgySelect = document.querySelector("#job-brgy");
        const jobBrgy = jobBrgySelect.options[jobBrgySelect.selectedIndex].text;

        const jobDesc = document.querySelector("#job-desc").value;
        const empRole = document.querySelector("#emp-role").value;

        const selectedEmploymentTypes = [];
        employmentButtons.forEach(button => {
            if (button.classList.contains('selected')) {
                selectedEmploymentTypes.push(button.getAttribute('data-type'));
            }
        });

        const jobBenefits = form.benefits || [];
        const jobQualifications = form.qualifications || [];

        // Save names instead of codes
        const data = {
            job_title: jobTitle,
            job_branch: jobBranch,
            job_province: jobProvince,  // Save name instead of code
            job_city: jobCity,  // Save name instead of code
            job_brgy: jobBrgy,  // Save name instead of code
            job_desc: jobDesc,
            emp_role: empRole,
            employment_types: selectedEmploymentTypes,
            job_benefits: jobBenefits,
            job_qualifications: jobQualifications
        };

        console.log('Add Job Data:', data);

        PostReqHandler('/insert_jobList/', data, function(response) {
            console.log('Add Job Response:', response);
            if (response.success) {
                Swal.fire({
                    title: "Job Created",
                    text: "Job has been created successfully",
                    icon: "success",
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.error || "Failed to create job",
                    icon: "error",
                });
            }
        });
    });
}

    // Edit form submission (for updating existing jobs)
    if (editForm) {
        editForm.addEventListener('submit', function(event) {
            event.stopPropagation();
            event.preventDefault();
    
            const jobCode = document.querySelector("#edit-job-code").value;
            const jobTitle = document.querySelector("#edit-job-title").value;
            const jobBranch = document.querySelector("#edit-job-branch").value;
    
            // Get selected province name instead of code
            const jobProvinceSelect = document.querySelector("#edit-job-province");
            const jobProvince = jobProvinceSelect.options[jobProvinceSelect.selectedIndex].text;
    
            // Get selected city name instead of code
            const jobCitySelect = document.querySelector("#edit-job-city");
            const jobCity = jobCitySelect.options[jobCitySelect.selectedIndex].text;
    
            // Get selected barangay name instead of code
            const jobBrgySelect = document.querySelector("#edit-job-brgy");
            const jobBrgy = jobBrgySelect.options[jobBrgySelect.selectedIndex].text;
    
            const jobDesc = document.querySelector("#edit-job-desc").value;
            const empRole = document.querySelector("#edit-emp-role").value;
    
            const employmentTypes = [];
            document.querySelectorAll("#edit-job-benefits .employment-type-btn.selected")
                .forEach(btn => employmentTypes.push(btn.getAttribute('data-type')));
    
            const jobBenefits = editForm.benefits || [];
            const jobQualifications = editForm.qualifications || [];
    
            const data = {
                job_code: jobCode,
                job_title: jobTitle,
                job_branch: jobBranch,
                job_province: jobProvince,  // Save name instead of code
                job_city: jobCity,  // Save name instead of code
                job_brgy: jobBrgy,  // Save name instead of code
                job_desc: jobDesc,
                emp_role: empRole,
                employment_types: employmentTypes,
                job_benefits: jobBenefits,
                job_qualifications: jobQualifications
            };
    
            console.log('Update Job Data:', data);
    
            PostReqHandler('/update_jobList/', data, function(response) {
                console.log('Update Job Response:', response);
                if (response.success) {
                    Swal.fire({
                        title: "Job Updated",
                        text: "Job details updated successfully",
                        icon: "success"
                    }).then(() => {
                        window.closetableModal();
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: "Error",
                        text: response.error || "Failed to update job",
                        icon: "error"
                    });
                }
            });
        });
    }
    
}












function api_jobLocation () {
    setTimeout(() => {
        const provinceDropdown = document.getElementById("job-province");
        const cityDropdown = document.getElementById("job-city");
        const barangayDropdown = document.getElementById("job-brgy");

        if (!provinceDropdown || !cityDropdown || !barangayDropdown) {
            console.error("Dropdown elements not found.");
            return;
        }

        console.log("Fetching provinces...");

        // Load Provinces
        fetch("https://psgc.gitlab.io/api/provinces")
            .then(response => response.json())
            .then(data => {
                provinceDropdown.innerHTML = '<option value="">Select Province</option>';
                data.forEach(province => {
                    let option = document.createElement("option");
                    option.value = province.code;
                    option.textContent = province.name;
                    provinceDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error("Error fetching provinces:", error);
                provinceDropdown.innerHTML = '<option value="">Failed to Load Provinces</option>';
            });

        // Load Cities when a Province is selected
        provinceDropdown.addEventListener("change", function () {
            const provinceCode = this.value;
            if (!provinceCode) return;

            console.log(`Fetching cities for province: ${provinceCode}`);
            cityDropdown.innerHTML = '<option value="">Loading Cities...</option>';
            barangayDropdown.innerHTML = '<option value="">Select Barangay</option>'; // Reset barangay dropdown

            fetch(`https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`)
                .then(response => response.json())
                .then(data => {
                    cityDropdown.innerHTML = '<option value="">Select City</option>';
                    data.forEach(city => {
                        let option = document.createElement("option");
                        option.value = city.code;
                        option.textContent = city.name;
                        cityDropdown.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error fetching cities:", error);
                    cityDropdown.innerHTML = '<option value="">Failed to Load Cities</option>';
                });
        });

        // Load Barangays when a City is selected
        cityDropdown.addEventListener("change", function () {
            const cityCode = this.value;
            if (!cityCode) return;

            console.log(`Fetching barangays for city: ${cityCode}`);
            barangayDropdown.innerHTML = '<option value="">Loading Barangays...</option>';

            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`)
                .then(response => response.json())
                .then(data => {
                    barangayDropdown.innerHTML = '<option value="">Select Barangay</option>';
                    data.forEach(barangay => {
                        let option = document.createElement("option");
                        option.value = barangay.code;
                        option.textContent = barangay.name;
                        barangayDropdown.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error fetching barangays:", error);
                    barangayDropdown.innerHTML = '<option value="">Failed to Load Barangays</option>';
                });
        });

    }, 500);
}





document.addEventListener('DOMContentLoaded', job);