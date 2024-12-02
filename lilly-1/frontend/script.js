document.addEventListener('DOMContentLoaded', () => {
    // Fetch all medicines
    fetch('http://localhost:8000/medicines')
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data);
            const medicineListSection = document.getElementById('medicine-list');

            if (data.medicines && data.medicines.length > 0) {
                const listTitle = document.createElement('h2');
                listTitle.textContent = 'Available Medicines';
                medicineListSection.appendChild(listTitle);

                const medList = document.createElement('ul');
                data.medicines.forEach(med => {
                    const medItem = document.createElement('li');
                    const price = parseFloat(med.price)
                    const priceText = !isNaN(price) ? `£${price.toFixed(2)}` : 'Unknown';

                    const medName = med.name && med.name.trim() !== "" ? med.name : 'Unknown Medicine';

                    medItem.textContent = `${medName}: ${priceText}`;
                    medList.appendChild(medItem);
                });
                medicineListSection.appendChild(medList);
            } else {
                medicineListSection.textContent = 'No medicines available.';
            }
        })
        .catch(error => {
            console.error('Error fetching medicines:', error);
            const medicineListSection = document.getElementById('medicine-list');
            medicineListSection.textContent = 'Failed to load medicines.';
        });

        fetch('http://localhost:8000/average_price')
    .then(response => response.json())
    .then(data => {
        const averagePriceSection = document.getElementById('average-price');
        averagePriceSection.innerHTML = '';
        const avgPriceTitle = document.createElement('h2');
        avgPriceTitle.textContent = 'Average Medicine Price';
        averagePriceSection.appendChild(avgPriceTitle);

        const avgPriceValue = document.createElement('p');
            avgPriceValue.textContent = `£${data.average_price.toFixed(2)}`;
            averagePriceSection.appendChild(avgPriceValue);
        })
        .catch(error => {
            console.error('Error fetching average price:', error);


    });
});



const addMedicineForm = document.getElementById('add-medicine-form');
addMedicineForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const nameInput = document.getElementById('med-name');
    const priceInput = document.getElementById('med-price');
    const messageDiv = document.getElementById('add-medicine-message');

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (isNaN(price) || price <= 0) {
        messageDiv.textContent = 'Please enter a valid value'
        messageDiv.style.color = 'red';
        return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    fetch('http://localhost:8000/create', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';

            nameInput.value = '';
            priceInput.value = '';

            loadMedicines()
            
        } else if (data.error) {
            messageDiv.textContent = data.error;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error adding medicine:', error);
        messageDiv.textContent = 'Failed to add medicine.';
        messageDiv.style.color = 'red';
    });
})

const deleteMedicineForm = document.getElementById('delete-medicine-form');
deleteMedicineForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const nameInput = document.getElementById('delete-med-name');
    const messageDiv = document.getElementById('delete-medicine-message');

    const name = nameInput.value.trim();

    if (name === null) {
        messageDiv.textContent = 'Please enter a valid medicine name'
        messageDiv.style.color = 'red';
        return;
    }

    const formData = new FormData();
    formData.append('name', name)

    fetch('http://localhost:8000/delete', {
        method: 'DELETE',
        body: formData,

    })
    .then(response => response.json())
    .then(data => {
        if(data.message) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';

            nameInput.value = '';
            loadMedicines();
        } else if (data.error) {
            messageDiv.textContent = data.error;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error deleting medicine', error)
        messageDiv.textContent = 'Failed to delete medicine'
        messageDiv.style.color = 'red';
    });
});


/*
medItem.textContent = `${med.name}: $${med.price}`;
medList.appendChild(medItem);


                    if (med.price === null) {
                        medItem.textContent = `${med.name}: ${'unknown'}`;
                    }
                    else {
                        medItem.textContent = `${med.name}: $${med.price}`;
                        medList.appendChild(medItem);
                    }
*/