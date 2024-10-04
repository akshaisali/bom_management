document.addEventListener('DOMContentLoaded', function () {
    const bomSelect = document.getElementById('bom-select');
    const itemDetailsDiv = document.getElementById('item-details');
    const componentSelectContainer = document.getElementById('component-select-container');
    const componentSelect = document.getElementById('component-select');
    
    // List of make choices
    const makeChoices = [
       "------", "Pusher", "Cumi", "Cumi (Premier)", "Dimond", "Fenner", "Emarco", "Nu Tech", "Lovejoy",
        "Audco", "NTN", "Raicer", "Legris", "Delta", "Vanaz", "Avcon", "IEPL", "Champion Coolers",
        "Jhonson", "Auro", "Bharat Bijlee", "Rossi", "SMC", "EP","HICARB","NILL","indan",
    ];

    bomSelect.addEventListener('change', function () {
        const bomId = this.value;

        if (bomId === "") {
            itemDetailsDiv.innerHTML = "";
            componentSelectContainer.style.display = 'none';
            return;
        }

        fetch(`/api/get_bom_details/${bomId}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    if (Array.isArray(data.components) && data.components.length > 0) {
                        componentSelectContainer.style.display = 'block';
                        componentSelect.innerHTML = '<option value="">Select a Component</option>';
                        data.components.forEach(component => {
                            let option = document.createElement('option');
                            option.value = component.id;
                            option.textContent = component.name;
                            componentSelect.appendChild(option);
                        });

                        const detailsHtml = `
                            <div class="card bg-secondary text-white mt-4">
                                <div class="card-body">
                                    <h3 class="card-title">BOM: ${data.bom.name}</h3>
                                    <div class="mb-3">
                                        <a href="/edit-bom/${data.bom.id}/" class="btn btn-warning btn-sm">Edit BOM</a>
                                        <a href="/delete-bom/${data.bom.id}/" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this BOM?');">Delete BOM</a>
                                    </div>
                                    <h4 class="mt-3">Components:</h4>
                                    <ul class="list-group">
                                        ${data.components.map(component => `
                                            <li class="list-group-item bg-dark text-white" id="component-${component.id}">
                                                <strong>${component.name}</strong>
                                                <div class="no-print">
                                                    <a href="/edit-component/${component.id}/" class="btn btn-warning btn-sm ms-2">Edit</a>
                                                    <a href="/delete-component/${component.id}/" class="btn btn-danger btn-sm ms-2" onclick="return confirm('Are you sure you want to delete this component?');">Delete</a>
                                                    <button class="btn btn-info btn-sm ms-2 print-component-btn" data-component-id="${component.id}">Print</button>
                                                </div>
                                                <table class="table table-bordered table-hover table-light mt-3">
                                                    <thead class="table-dark">
                                                        <tr>
                                                            <th>S No</th>
                                                            <th>Specification</th>
                                                            <th>Make</th>
                                                            <th>Purpose</th>
                                                            <th>Quality</th>
                                                            <th>Rate</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                            <th class="no-print">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        ${component.specifications.map((spec, index) => `
                                                        <tr>
                                                            <td>${index + 1}</td>
                                                            <td>${spec.specification || 'N/A'}</td>
                                                            <td>${getMakeDropdown(spec.make)}</td> <!-- Dynamic Make Dropdown -->
                                                            <td>${spec.purpose || 'N/A'}</td>
                                                            <td>${spec.quality || 'N/A'}</td>
                                                            <td>${spec.rate || 'N/A'}</td>
                                                            <td>${spec.price || 'N/A'}</td>
                                                            <td>${spec.total || 'N/A'}</td>
                                                            <td class="no-print">
                                                                <a href="/edit-specification/${spec.id}/" class="btn btn-warning btn-sm">Edit</a>
                                                                <a href="/delete-specification/${spec.id}/" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this specification?');">Delete</a>
                                                            </td>
                                                        </tr>`).join('')}
                                                    </tbody>
                                                </table>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        `;
                        itemDetailsDiv.innerHTML = detailsHtml;

                        // Add event listeners for print buttons
                        const printButtons = document.querySelectorAll('.print-component-btn');
                        printButtons.forEach(button => {
                            button.addEventListener('click', function (event) {
                                event.stopPropagation(); // Prevent parent event listeners
                                const componentId = this.getAttribute('data-component-id');
                                const componentElement = document.getElementById(`component-${componentId}`);
                                if (componentElement) {
                                    printComponent(componentElement.outerHTML);
                                }
                            });
                        });
                    } else {
                        itemDetailsDiv.innerHTML = "<div class='alert alert-warning'>No components found for the selected BOM.</div>";
                        componentSelectContainer.style.display = 'none';
                    }
                } else {
                    itemDetailsDiv.innerHTML = "<div class='alert alert-danger'>No details found for the selected BOM.</div>";
                    componentSelectContainer.style.display = 'none';
                }
            })
            .catch(error => {
                console.error("Error fetching details:", error);
                itemDetailsDiv.innerHTML = "<div class='alert alert-danger'>Error loading details. Please try again later.</div>";
            });
    });

    // Function to create dynamic dropdown for make
    function getMakeDropdown(selectedMake) {
        return `
            <select class="form-select">
                <option value="">Select Make</option>
                ${makeChoices.map(make => `
                    <option value="${make}" ${make === selectedMake ? 'selected' : ''}>${make}</option>
                `).join('')}
            </select>
        `;
    }

    // Improved print function
    function printComponent(componentHTML) {
        const printWindow = window.open('', '', 'width=1200,height=1000');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Print Component</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        table, th, td { border: 1px solid black; padding: 5px; }
                        th { background-color: #f2f2f2; }
                        .no-print { display: none !important; }
                    </style>
                </head>
                <body>
                    ${componentHTML}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.onload = function () {
            printWindow.print();
            setTimeout(function () {
                printWindow.close();
            }, 1000);
        };
    }
});function getMakeLabel(makeValue) {
    const makeChoices = {
        'Pusher': 'Pusher',
        'Cumi': 'Cumi',
        'Cumi (Premier)': 'Cumi (Premier)',
        'Dimond': 'Dimond',
        'Fenner': 'Fenner',
        'Emarco': 'Emarco',
        'Nu Tech': 'Nu Tech',
        'Lovejoy': 'Lovejoy',
        'Audco': 'Audco',
        'NTN': 'NTN',
        'Raicer': 'Raicer',
        'Legris': 'Legris',
        'Delta': 'Delta',
        'Vanaz': 'Vanaz',
        'Avcon': 'Avcon',
        'IEPL': 'IEPL',
        'Champion Coolers': 'Champion Coolers',
        'Jhonson': 'Jhonson',
        'Auro': 'Auro',
        'Bharat Bijlee': 'Bharat Bijlee',
        'Rossi': 'Rossi',
        'SMC': 'SMC',
        'EP': 'EP',
        'HICARB':'HICARB',
        'NILL':'NILL',
        'indian':'indian',
    };
    return makeChoices[makeValue] || 'N/A';  // Return the label or 'N/A' if not found
}
