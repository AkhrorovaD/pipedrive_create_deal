
document.getElementById('jobForm').addEventListener('submit', function(event) {
    event.preventDefault();

    
    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        job_type: document.getElementById('jobType').value,
        job_source: document.getElementById('jobSource').value,
        job_description: document.getElementById('jobDescription').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip_code: document.getElementById('zipCode').value,
        area: document.getElementById('area').value,
        start_date: document.getElementById('startDate').value,
        start_time: document.getElementById('startTime').value,
        end_time: document.getElementById('endTime').value,
        test_select: document.getElementById('testSelect').value
    };

    fetch('http://localhost:3000/api/addDeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_DEVELOPMENT_TOKEN_HERE`,
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response Data:', data);
        if (data.message === 'Deal added successfully!') {
            console.log('Success:', data);

    document.getElementById('jobForm').reset();
    const modalContent = document.querySelector('.modal-content');
    const jobForm = document.getElementById('jobForm');

    if (jobForm && modalContent) {
        jobForm.remove();
        const successMessage = document.createElement('div');
        successMessage.id = 'successMessage';
        successMessage.innerHTML = `Job is created! <a href="https://co6.pipedrive.com/pipeline/1/user/everyone" target="_blank">View deal in Workiz</a>`;
        modalContent.appendChild(successMessage);
    } else {
                console.error('Modal content element not found');
            }
        } else {
            console.error('Unexpected response:', data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
