document.addEventListener('DOMContentLoaded', function () {
    const createVacationForm = document.querySelector("#createVacationForm");
    createVacationForm.addEventListener("submit", createVacation);

    function createVacation(event) {
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
                    <strong>Success!</strong> Vacation successfully created.
                </div>`;
                form.reset();
                getVacations();
            } else {
                throw new Error("Failed to create vacation.");
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

    function getVacations() {
        fetch("http://127.0.0.1:8000/getVacations")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayVacations(data);
        })
        .catch(error => console.error("Error:", error));
    }

    function displayVacations(data) {
        const vacationList = document.getElementById('vacationList');
        vacationList.innerHTML = ''; // Clear previous data

        data.forEach(vacation => {
            const vacationItem = document.createElement('div');
            vacationItem.classList.add('card', 'mb-3');
            vacationItem.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title vacation-title">${vacation.title}</h5>
                    <p class="card-text vacation-description">${vacation.description}</p>
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${vacation.photos[0]}" class="img-fluid vacation-image" alt="Vacation Image">
                        </div>
                        <div class="col-md-6">
                            <ul class="list-group">
                                <li class="list-group-item">Country: ${vacation.country}</li>
                                <li class="list-group-item">City: ${vacation.city}</li>
                                <li class="list-group-item">Duration: ${vacation.duration}</li>
                                <li class="list-group-item">Price: $${vacation.price.toFixed(2)}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            vacationList.appendChild(vacationItem);
        });
    }

    // Initial load of vacations
    getVacations();
});
