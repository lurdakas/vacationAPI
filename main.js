// document.addEventListener('DOMContentLoaded', function () {
//     const createVacationForm = document.querySelector("#createVacationForm");
//     createVacationForm.addEventListener("submit", createVacation);

//     const updateButton = document.querySelector("#updateButton");
//         updateButton.addEventListener("submit", updateVacation);

//     const deleteButton = document.querySelector("#deleteButton");
//         deleteButton.addEventListener("submit", deleteVacation);

        
        let form = document.querySelector("#createVacationForm");
        let formBtn = document.querySelector("#formBtn");
        let alertsContainer = document.querySelector("#alerts");
        let baseUrl = "http://127.0.0.1";
        let port = ":8000";
        
        form.addEventListener("submit", createVacation);
        getVacations();



    function getVacationByCountry(event) {
        event.preventDefault();
        const form = event.target;
        const formData = {
            title: form.title.value,
            country: form.country.value,
            city: form.city.value,
            duration: form.duration.value,
            description: form.description.value,
            price: parseFloat(form.price.value),
            photos: form.photos.value.split(",").map(photo => photo.trim())
        };

        fetch("http://127.0.0.1:8000/getVacationByCountry?country=", {
            method: "GET",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                document.querySelector("#alerts").innerHTML = 
                `<div class="alert alert-success">
                    <strong>Success!</strong> Vacation successfully displayed.
                </div>`;
                form.reset();
                getVacations();
            } else {
                throw new Error("Failed to find vacation.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.querySelector("#alerts").innerHTML = 
            `<div class="alert alert-danger">
                <strong>Error!</strong> Failed to create vacation.
            </div>`;
        });
    }



    function createVacation(event) {
        event.preventDefault();
        const form = event.target;
        const formData = {};
        for (let field of form.elements) {
            if (field.name) {
                formData[field.name] = field.value;
            }
        }
        fetch(`${baseUrl}${port}/createVacation`, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    showAlert("Vacation Created");
                    form.reset();
                    getVacations();
                }
            })
    }




    

    function fillTable(data) {
        let tbody = document.querySelector("#tbody");
        let HTML = "";
        let counter = 1;
        data.forEach(user => {
            HTML += ` <tr>
                                <td>${counter++}</td>
                                <td>${trip.id}</td>
                                <td>${trip.title}</td>
                                <td>${trip.country}</td>
                                <td>${trip.city}</td>
                                <td>${trip.duration}</td>
                                <td>${trip.season}</td>
                                <td>${trip.description}</td>
                                <td>${trip.price}</td>
                                <td>
                                    <c:forEach var="photo" items="${trip.photos}">
                                        <img src="${photo}" alt="Photo" class="img-thumbnail">
                                    </c:forEach>
                                </td>
                                <td>
                                    <c:forEach var="rating" items="${trip.rating}">
                                        <span>${rating}</span>
                                    </c:forEach>
                                </td>
                            </tr>`;
    });
        tbody.innerHTML = HTML;
        addEventListenersOnUpdate();
        addEventListenersOnDelete();

    }
    function addEventListenersOnUpdate() {
        let updateBnts = document.querySelectorAll(".update");
        updateBnts.forEach(btn => {
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                editVacation(btn.getAttribute("vacationId"));
                window.scrollTo(0, 0);
            })
        });
    }
    
    function addEventListenersOnDelete() {
        let deleteBnts = document.querySelectorAll(".delete");
        deleteBnts.forEach(btn => {
            btn.addEventListener("click", function (event) {
                deleteVacation(btn.getAttribute("vacationId"));
            })
        });
    }


    function updateVacation(event) {
        event.preventDefault();
        const form = event.target;
        const formData = {};
        for (let field of form.elements) {
            if (field.name) {
                formData[field.name] = field.value;
            }
        }
        fetch(`${baseUrl}${port}/updateVacation`, {
            method: "POST",
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    showAlert("Renewed");
                    form.reset();
                    getVacations();
                    toggleForm(false);
                }
            })
    }




    function deleteVacation() {
        const form = document.querySelector("#createVacationForm");
        const vacationId = form.id.value;

        fetch(`http://127.0.0.1:8000/deleteVacation?id=${vacationId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (response.ok) {
                document.querySelector("#alerts").innerHTML = 
                `<div class="alert alert-success">
                    <strong>Success!</strong> Vacation successfully deleted.
                </div>`;
                form.reset();
                getVacations();
            } else {
                throw new Error("Failed to delete vacation.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.querySelector("#alerts").innerHTML = 
            `<div class="alert alert-danger">
                <strong>Error!</strong> Failed to delete vacation.
            </div>`;
        });
    }







    function getVacations() {
        fetch(`${baseUrl}${port}/getVacations`)
            .then(response => response.json())
            .then(data => {
                fillTable(data);
            })

    }

    createButton.addEventListener('click', function () {
        // Show the form
        createVacationForm.style.display = 'block';
    });

    createVacationForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        
        const formData = {};
        for (let field of createVacationForm.elements) {
            if (field.name) {
                formData[field.name] = field.value;
            }
        }

        fetch('http://127.0.0.1:8000/createVacation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Vacation created successfully!');
                createVacationForm.reset();
                createVacationForm.style.display = 'none';
                getVacations();
            } else {
                alert('Failed to create vacation.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create vacation.');
        });
    });


    function toggleForm(state) {
        formBtn.classList.toggle("btn-success");
        formBtn.classList.toggle("btn-primary");
        document.querySelector("#id").value = "";
        if (state) {
            formBtn.innerText = "Updated";
            form.removeEventListener("submit", createVacation);
            form.addEventListener("submit", updateVacation);
    
        } else {
            formBtn.innerText = "Save";
            form.removeEventListener("submit", updateVacation);
            form.addEventListener("submit", createVacation);
        }
    }
    
    function showAlert(status) {
        alertsContainer.innerHTML = `
            <div class="alert alert-success">
                <strong>Success!</strong> Vacation ${status}.
            </div>
        `;
        setTimeout(() => {
            alertsContainer.innerHTML = ''; // Clear the alert message
        }, 3000);
    }


    function fillForm(user) {

        document.querySelector("#title").value = user.title;
        document.querySelector("#description").value = user.description;
        document.querySelector("#country").value = user.country;
        document.querySelector("#city").value = user.city;
        document.querySelector("#duration").value = user.duration;
        document.querySelector("#season").value = user.season;
        document.querySelector("#rating").value = user.rating;
    }
    
    getVacations();

