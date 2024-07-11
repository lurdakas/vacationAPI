
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
        const formData = {
            photos: [],
            rating: [] // Assuming rating is an array of integers
        };
    
        for (let field of form.elements) {
            if (field.name) {
                if (field.name === "photos") {
                    // Handle multiple photo inputs
                    formData.photos.push(field.value);
                } else if (field.name === "rating") {
                    // Handle rating inputs as integers
                    formData.rating.push(parseInt(field.value));
                } else {
                    formData[field.name] = field.value;
                }
            }
        }
    
        console.log(formData);
    
        fetch(`${baseUrl}${port}/createVacation`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                showAlert("Vacation Created");
                form.reset();
                getVacations();
            } else {
                console.error('Failed to create vacation:', response.status);
            }
        }).catch(error => {
            console.error('There was an error with the fetch operation:', error);
        });
    }
    

    

    

    function fillTable(data) {
        let tbody = document.querySelector("#tbody");
        let HTML = "";
        let counter = 1;
        data.forEach(vacation => {
            HTML += ` <tr>
                                <td>${counter++}</td>
                                <td>${vacation.title}</td>
                                <td>${vacation.country}</td>
                                <td>${vacation.city}</td>
                                <td>${vacation.duration}</td>
                                <td>${vacation.season}</td>
                                <td>${vacation.description}</td>
                                <td>${vacation.photos}</td>
                                <td>${vacation.price}</td>
                              
                    </tr>`;
    });
        tbody.innerHTML = HTML;
        addEventListenersOnUpdate();
        addEventListenersOnDelete();
    }




    function addEventListenersOnUpdate() {
        let updateButtons = document.querySelectorAll('.update');
        updateButtons.forEach(btn => {
            btn.addEventListener('click', function(event) {
                event.preventDefault();
                updateVacation(btn.getAttribute("vacationId"));
                showAlert("updated");
                window.scroll(0,0);
          })
      });
    }
    
    function addEventListenersOnDelete() {
        let deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(btn => {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();
                    deleteVacation(btn.getAttribute("vacationId"));
                    showAlert("deleted");
                    window.scroll(0,0);
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
    
   




    function deleteVacation() {
        const formData = {"id": vacationId};
        fetch(`${baseUrl}${port}/deleteVacation`, {
            method: "POST", 
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok){
                getVacations();
                showAlert("deleted");
            }
        })

    }




    function getVacations() {
        fetch(`${baseUrl}${port}/getVacations`)
            .then(response => response.json())
            .then(data => {
                fillTable(data);
            })
            .catch(error => {
                console.error('Error fetching vacations:', error);
            });
    }
    
    // Initial call to fetch vacations
    getVacations();





    function fetchVacations() {
        fetch('http://127.0.0.1:8000/getVacations')
            .then(response => response.json())
            .then(vacations => {
                const tbody = document.getElementById('tbody');
                tbody.innerHTML = ''; // Clear any previous data

                vacations.forEach(vacation => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${vacation.id}</td>
                        <td>${vacation.title}</td>
                        <td>${vacation.country}</td>
                        <td>${vacation.city}</td>
                        <td>${vacation.duration}</td>
                        <td>${vacation.season}</td>
                        <td>${vacation.description}</td>
                        <td>${vacation.price}</td>
                        <td>${vacation.photos}</td>
                        <td>${vacation.rating.join(', ')}</td>
                          <td>
                        <a href="" vacationId="${vacation.country}"class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>

                        <a href="" vacationId="${vacation.id}"class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                       </td>
                    `;
                    tbody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching vacations:', error);
            });
    }

    document.addEventListener('DOMContentLoaded', fetchVacations);




    document.getElementById('countryForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
        const country = document.getElementById('country').value;

        fetch(`http://127.0.0.1:8000/getVacationByCountry?country=${encodeURIComponent(country)}`)
            .then(response => response.json())
            .then(vacations => {
                const vacationContainer = document.getElementById('vacationContainer');
                vacationContainer.innerHTML = ''; // Clear any previous results

                if (vacations.length === 0) {
                    vacationContainer.innerHTML = '<p>No vacations found.</p>';
                } else {
                    vacations.forEach(vacation => {
                        const vacationElement = document.createElement('div');
                        vacationElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title vacation-title">${vacation.title}</h5>
                    <p class="card-text vacation-description">${vacation.description}</p>
                                           
                        <div class="row">

                          <div class="col-md-6">
                                ${vacation.photos.map(photo => `<img src="${photo}" alt="Vacation Photo" width="180">`).join('')}
                         </div>
                            <div class="col-md-6">
                             <ul class="list-group">
                            <p><strong>Country:</strong> ${vacation.country}</p>
                            <p><strong>City:</strong> ${vacation.city}</p>
                            <p><strong>Duration:</strong> ${vacation.duration}</p>
                            <p><strong>Season:</strong> ${vacation.season}</p>
                            <p><strong>Price:</strong> $${vacation.price}</p>
                            <p><strong>Rating:</strong> ${vacation.rating.join(', ')}</p>
                            </ul>
                          </div>
                         </div>
                         </div>
                       `;
                        vacationContainer.appendChild(vacationElement);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching vacations:', error);
            });
    });


function showAlert(status){
    alertsContainer.innerHTML = `
    <div class="alert alert success">
        <strong>Success!</strong> Vacation successfully ${status}. 
    </div>
    `;
    setTimeout(() => {
        alertsContainer.innerHTML = '';
    }, 3000);
}




    function fillForm(vacation) {

        document.querySelector("#id").value = vacation.id;
        document.querySelector("#title").value = vacation.title;
        document.querySelector("#country").value = vacation.country;
        document.querySelector("#city").value = vacation.city;
        document.querySelector("#duration").value = vacation.duration;
        document.querySelector("#season").value = vacation.season;
        document.querySelector("#description").value = vacation.description;
        document.querySelector("#price").value = vacation.price;
        // document.querySelector("#photos").value = vacation.photos;
        document.querySelector("#rating").value = vacation.rating;
    }
    
    // getVacations();

