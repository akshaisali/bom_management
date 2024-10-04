
document.addEventListener('DOMContentLoaded', function () {
    function updateComponentLabels(selectedBOM) {
        const componentLabels = {
            washing: {
                'washing_80':  ['Front Door ', 'Tank ', 'Rear Conveyor '],
                'washing_100': ['Front Door ', 'Tank ', 'Rear Conveyor '],
                'washing_120': ['Front Door ', 'Tank ', 'Rear Conveyor 0']
            },
            SQF: {
                'SQF_80': ['Pusher', 'Heat Champer', 'Queching Tank '],
                'SQF_100':['Pusher', 'Heat Champer', 'Queching Tank '],
                'SQF_120':['Pusher', 'Heat Champer', 'Queching Tank ']
            },
            tempering: {
                'tempering_80': ['Front Conveyor ', 'Furnace ', 'Rear Conveyor ','Electrial'],
                'tempering_100': ['Front Conveyor ', 'Furnace ', 'Rear Conveyor','Electrial'],
                'tempering_120': ['Front Conveyor ', 'Furnace ', 'Rear Conveyor','Electrial']
            },
            conveyor: {
                'conveyor_80': ['Component 1P', 'Component 2P', 'Component 3P'],
                'conveyor_100': ['Component 1Q', 'Component 2Q', 'Component 3Q'],
                'conveyor_120': ['Component 1R', 'Component 2R', 'Component 3R']
            },
            preheating: {
                'preheating_80': ['Component 1PH80', 'Component 2PH80', 'Component 3PH80'],
                'preheating_100': ['Component 1PH100', 'Component 2PH100', 'Component 3PH100'],
                'preheating_120': ['Component 1PH120', 'Component 2PH120', 'Component 3PH120']
            },
            front_door: {
                'front_door_80': ['Component FD80A', 'Component FD80B', 'Component FD80C'],
                'front_door_100': ['Component FD100A', 'Component FD100B', 'Component FD100C'],
                'front_door_120': ['Component FD120A', 'Component FD120B', 'Component FD120C']
            },
            rear_door: {
                'rear_door_80': ['Component RD80A', 'Component RD80B', 'Component RD80C'],
                'rear_door_100': ['Component RD100A', 'Component RD100B', 'Component RD100C'],
                'rear_door_120': ['Component RD120A', 'Component RD120B', 'Component RD120C']
            },
            double_door: {
                'double_door_80': ['Component DD80A', 'Component DD80B', 'Component DD80C'],
                'double_door_100': ['Component DD100A', 'Component DD100B', 'Component DD100C'],
                'double_door_120': ['Component DD120A', 'Component DD120B', 'Component DD120C']
            }
        };

        const selectedCategory = selectedBOM.split('_')[0];
        const selectedLabels = componentLabels[selectedCategory][selectedBOM] || [];

        document.querySelectorAll(`#component-section-${selectedCategory} input[type="checkbox"]`).forEach((checkbox, index) => {
            checkbox.nextElementSibling.textContent = selectedLabels[index] || '';
        });
    }

    function toggleComponents() {
        const bomSelect = document.getElementById('bom').value;
        const modelSelect = document.getElementById('model').value;
        const componentSections = ['washing', 'SQF', 'tempering', 'conveyor', 'preheating', 'front_door', 'rear_door', 'double_door',];

        componentSections.forEach(section => {
            document.getElementById(`component-section-${section}`).style.display = 'none';
        });

        if (bomSelect) {
            const selectedSection = bomSelect.split('_')[0];
            document.getElementById(`component-section-${selectedSection}`).style.display = 'block';
            updateComponentLabels(bomSelect);

            if (selectedSection === 'furnace') {
                fetchFurnaceData(bomSelect);
            } else {
                fetchEquipmentData(bomSelect, modelSelect);
            }
        }
    } 

    function getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    }

    function fetchEquipmentData(bom, model) {
        fetch('/get-equipment-data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken()
            },
            body: JSON.stringify({ bom, model })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('data-container').innerHTML = data.html;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('data-container').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        });
    }

   
    document.getElementById('bom').addEventListener('change', toggleComponents);
    document.getElementById('model').addEventListener('change', toggleComponents);
});

document.addEventListener('DOMContentLoaded', function() {
    const furnaceCheckbox = document.getElementById('component2_tempering');
    const furnaceDataDiv = document.getElementById('furnace-data');

    // Hide furnace data div initially
    furnaceDataDiv.style.display = 'none';

    furnaceCheckbox.addEventListener('change', function() {
        if (this.checked) {
            fetchFurnaceData();
        } else {
            furnaceDataDiv.style.display = 'none';
        }
    });

    function fetchFurnaceData() {
        fetch('/get_furnace_data/')
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    // Handle empty data case
                    furnaceDataDiv.innerHTML = '<p>No Furnace data available.</p>';
                } else {
                    displayFurnaceData(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                furnaceDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
                furnaceDataDiv.style.display = 'block';
            });
    }
    function displayFurnaceData(data) {
        // Create the table headers
        let tableHTML = `
            <h3>Furnace Data:</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Equipment BOM</th>
                        <th>Model</th>
                        <th>Specification</th>
                        <th>Make</th>
                        <th>Purpose</th>
                        <th>Quality</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Add each entry as a row in the table
        data.forEach(entry => {
            tableHTML += `
                <tr>
                    <td>${entry.type}</td>
                    <td>${entry.model}</td>
                    <td>${entry.specification}</td>
                    <td>${entry.make}</td>
                    <td>${entry.purpose}</td>
                    <td>${entry.quality}</td>
                    <td>${entry.price}</td>
                    <td>${entry.total}</td>
                </tr>
            `;
        });

        // Close the table tags
        tableHTML += `
                </tbody>
            </table>
        `;

        // Update the inner HTML of the div to include the table
        furnaceDataDiv.innerHTML = tableHTML;
        furnaceDataDiv.style.display = 'block';
    }
});

function fetchRearConveyorData() {
    fetch('/get_rear_conveyor_data/')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                rearConveyorDataDiv.innerHTML = '<p>No Rear Conveyor data available.</p>';
            } else {
                displayRearConveyorData(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            rearConveyorDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
            rearConveyorDataDiv.style.display = 'block';
        });
}
document.addEventListener('DOMContentLoaded', function () {
    // Checkbox and data divs mapping
    const componentConfig = [
        {
            checkboxId: 'component3_tempering', // Adjust ID based on your actual checkbox
            dataDivId: 'rearconveyor-data',
            fetchUrl: '/get_rear_conveyor_data/',
            noDataMessage: 'No Rear Conveyor data available.',
            errorMessage: 'Error fetching Rear Conveyor data. Please try again later.',
            title: 'Rear Conveyor Data:',
        },
        {
            checkboxId: 'component4_tempering', // Adjust ID based on your actual checkbox
            dataDivId: 'electrical-data',
            fetchUrl: '/get_electrical_data/',
            noDataMessage: 'No Electrical data available.',
            errorMessage: 'Error fetching Electrical data. Please try again later.',
            title: 'Electrical Data:',
        }
    ];

    componentConfig.forEach(({ checkboxId, dataDivId, fetchUrl, noDataMessage, errorMessage, title }) => {
        const checkbox = document.getElementById(checkboxId);
        const dataDiv = document.getElementById(dataDivId);

        // Hide data div initially
        dataDiv.style.display = 'none';

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                fetchData(fetchUrl, dataDiv, noDataMessage, errorMessage, title);
            } else {
                dataDiv.style.display = 'none';
            }
        });
    });

    function fetchData(url, dataDiv, noDataMessage, errorMessage, title) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    dataDiv.innerHTML = `<p>${noDataMessage}</p>`;
                } else {
                    displayData(data, dataDiv, title);
                }
                dataDiv.style.display = 'block';
            })
            .catch(error => {
                console.error(errorMessage, error);
                dataDiv.innerHTML = `<p>${errorMessage}</p>`;
                dataDiv.style.display = 'block';
            });
    }

    function displayData(data, dataDiv, title) {
        let tableHTML = `
            <h3>${title}</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Equipment BOM</th>
                        <th>Model</th>
                        <th>Specification</th>
                        <th>Make</th>
                        <th>Purpose</th>
                        <th>Quality</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(entry => {
            tableHTML += `
                <tr>
                    <td>${entry.type}</td>
                    <td>${entry.model}</td>
                    <td>${entry.specification}</td>
                    <td>${entry.make}</td>
                    <td>${entry.purpose}</td>
                    <td>${entry.quality}</td>
                    <td>${entry.price}</td>
                    <td>${entry.total}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        dataDiv.innerHTML = tableHTML;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const frontConveyorCheckbox = document.getElementById('component1_tempering'); // Adjust ID based on your actual checkbox
    const frontConveyorDataDiv = document.getElementById('frontconveyor-data');

    // Hide the data div initially
    frontConveyorDataDiv.style.display = 'none';

    // Add event listener for the checkbox
    frontConveyorCheckbox.addEventListener('change', function () {
        if (this.checked) {
            fetchFrontConveyorData();
        } else {
            frontConveyorDataDiv.style.display = 'none';
        }
    });

    function fetchFrontConveyorData() {
        fetch('/get_front_conveyor_data/')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                frontConveyorDataDiv.innerHTML = '<p>No Rear Conveyor data available.</p>';
            } else {
                displayFrontConveyorData(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            frontConveyorDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
            frontConveyorDataDiv.style.display = 'block';
        });
    }

    function displayFrontConveyorData(data) {
        let tableHTML = `
        
            <h3>Front Conveyor Data:</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Equipment BOM</th>
                        <th>Model</th>
                        <th>Specification</th>
                        <th>Make</th>
                        <th>Purpose</th>
                        <th>Quality</th>
                        <th>Price</th>
                        <th>Total</th>
                        
                    </tr>
                </thead>
                <tbody>
        `;
    
        data.forEach(entry => {
            tableHTML += `
                <tr>
                    <td>${entry.type}</td>
                    <td>${entry.model}</td>
                    <td>${entry.specification}</td>
                    <td>${entry.make}</td>
                    <td>${entry.purpose}</td>
                    <td>${entry.quality}</td>
                    <td>${entry.price}</td>
                    <td>${entry.total}</td>
                    <td>
                       
                    </td>
                </tr>
            `;
            
        });

        tableHTML += `
                </tbody>
            </table>
        `;
    
        frontConveyorDataDiv.innerHTML = tableHTML;
        frontConveyorDataDiv.style.display = 'block';
        
    
    }
       
    const electricalCheckbox = document.getElementById('component4_tempering'); // Adjust ID based on your actual checkbox
    const electricalDataDiv = document.getElementById('electrial-data');

    electricalDataDivDiv.style.display = 'none';

    electricalCheckbox.addEventListener('change', function() {
        if (this.checked) {
            fetchElectricalData();
        } else {
            electricalDataDiv.style.display = 'none';
        }
    });

    function fetchElectricalData() {
        fetch('/get_electrial_data/')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched electrical data:', data); // Log data
                if (data.length === 0) {
                    electricalDataDiv.innerHTML = '<p>No Electrical data available.</p>';
                } else {
                    displayElectricalData(data);
                }
                electricalDataDiv.style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching electrical data:', error);
                electricalDataDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
                electricalDataDiv.style.display = 'block';
            });
    }

    function displayElectricalData(data) {
        // Filter data based on selected type and model
        const filteredData = data.filter(entry => entry.type === selectedType && entry.model === selectedModel);
    
        let tableHTML = '';
        if (filteredData.length === 0) {
            tableHTML += `<p>Electrical ${selectedType} ${selectedModel} data not available.</p>`;
        } else {
            tableHTML += `
                <h3>Electrical ${selectedType} ${selectedModel}:</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Equipment BOM</th>
                            <th>Model</th>
                            <th>Specification</th>
                            <th>Make</th>
                            <th>Purpose</th>
                            <th>Quality</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
    
            filteredData.forEach(entry => {
                tableHTML += `
                    <tr>
                        <td>${entry.type}</td>
                        <td>${entry.model}</td>
                        <td>${entry.specification}</td>
                        <td>${entry.make}</td>
                        <td>${entry.purpose}</td>
                        <td>${entry.quality}</td>
                        <td>${entry.price}</td>
                        <td>${entry.total}</td>
                    </tr>
                `;
            });
    
            tableHTML += `
                    </tbody>
                </table>
            `;
        }
    
        electricalDataDiv.innerHTML = tableHTML;
        electricalDataDiv.style.display = 'block';
    }
});
document.addEventListener('DOMContentLoaded', function () {
    const availableTypes = ['80', '100', '120'];
    const availableModels = ['model_a', 'model_b', 'model_c'];
    let selectedType = null;
    let selectedModel = null;

    // Function to fetch data for a specific component, type, and model
    function fetchComponentData(component, type, model) {
        const url = `/get_${component.toLowerCase().replace(' ', '_')}_data/?type=${type}&model=${model}`;
        console.log(`Fetching data from URL: ${url}`); // Debug: Check the URL being called

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(`Fetched data for ${component}:`, data); // Debug: Log fetched data
                return { component, data };
            })
            .catch(error => {
                console.error(`Error fetching ${component} data:`, error);
                return { component, data: [], error: true };
            });
    }

    // Function to display fetched data based on the selected type and model
    function displayComponentData(allData) {
        allData.forEach(({ component, data }) => {
            // Filter data based on selected type and model
            const filteredData = data.filter(entry => entry.type === selectedType && entry.model === selectedModel);
            console.log(`Filtered data for ${component}:`, filteredData); // Debug: Check filtered data

            let tableHTML = '';
            if (filteredData.length === 0) {
                tableHTML += `<p>No ${component} data available for type ${selectedType} and model ${selectedModel}.</p>`;
            } else {
                tableHTML += `
                    <h3>${component} ${selectedType} ${selectedModel}:</h3>
                    <table id="${component.toLowerCase()}-table" class="table">
                        <thead>
                            <tr>
                                <th>Equipment BOM</th>
                                <th>Model</th>
                                <th>Specification</th>
                                <th>Make</th>
                                <th>Purpose</th>
                                <th>Quality</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Action</th> <!-- Action column for dropdown -->
                            </tr>
                        </thead>
                        <tbody>
                `;

                filteredData.forEach(entry => {
                    tableHTML += `
                        <tr class="data-row">
                            <td>${entry.type}</td>
                            <td>${entry.model}</td>
                            <td>${entry.specification}</td>
                            <td>${entry.make}</td>
                            <td>${entry.purpose}</td>
                            <td>${entry.quality}</td>
                            <td>${entry.price}</td>
                            <td>${entry.total}</td>
                            <td>
                                <select class="action-dropdown" style="width: 100%;">
                                    <option value="">Select Action</option>
                                    <option value="add_row">Add New Row Below</option>
                                    <option value="add_heading">Add Heading</option>
                                </select>
                            </td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;
            }

            const componentDivId = `${component.toLowerCase().replace(' ', '')}-data`;
            const componentDataDiv = document.getElementById(componentDivId);
            if (componentDataDiv) {
                componentDataDiv.innerHTML = tableHTML;
                componentDataDiv.style.display = 'block';

                // Add event listener for dropdown change
                addDropdownEventListeners(componentDivId);
            }
        });
    }

    // Function to add event listeners to action dropdowns for row insertion
    function addDropdownEventListeners(componentDivId) {
        const dropdowns = document.querySelectorAll(`#${componentDivId} .action-dropdown`);
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', function () {
                const currentRow = this.closest('tr');
                if (this.value === 'add_row') {
                    insertNewRow(currentRow);
                } else if (this.value === 'add_heading') {
                    insertNewHeading(currentRow);
                }
                this.value = ''; // Reset dropdown value after action
            });
        });
    }

    // Function to insert a new row below the selected row
    function insertNewRow(referenceRow) {
        const newRow = document.createElement('tr');
        newRow.classList.add('new-data-row');

        // Populate new row with default empty cells or inputs as needed
        newRow.innerHTML = `
            <td><input type="text" placeholder="Type"></td>
            <td><input type="text" placeholder="Model"></td>
            <td><input type="text" placeholder="Specification"></td>
            <td><input type="text" placeholder="Make"></td>
            <td><input type="text" placeholder="Purpose"></td>
            <td><input type="text" placeholder="Quality"></td>
            <td><input type="number" placeholder="Price"></td>
            <td><input type="number" placeholder="Total"></td>
            <td>
                <select class="action-dropdown" style="width: 100%;">
                    <option value="">Select Action</option>
                    <option value="add_row">Add New Row Below</option>
                    <option value="add_heading">Add Heading</option>
                </select>
            </td>
        `;

        // Insert the new row after the reference row
        referenceRow.parentNode.insertBefore(newRow, referenceRow.nextSibling);

        // Re-add event listener to the new dropdown in the newly inserted row
        const newDropdown = newRow.querySelector('.action-dropdown');
        newDropdown.addEventListener('change', function () {
            if (this.value === 'add_row') {
                insertNewRow(newRow);
            } else if (this.value === 'add_heading') {
                insertNewHeading(newRow);
            }
            this.value = ''; // Reset dropdown value after action
        });
    }

    // Function to insert a new heading row below the selected row
    function insertNewHeading(referenceRow) {
        const headingRow = document.createElement('tr');
        headingRow.classList.add('heading-row');

        // Populate heading row with a single cell spanning all columns
        headingRow.innerHTML = `
            <td colspan="9" contenteditable="true" style="font-weight: bold; text-align: center; background-color: #f2f2f2;">
                Enter Heading Title
            </td>
        `;

        // Insert the heading row after the reference row
        referenceRow.parentNode.insertBefore(headingRow, referenceRow.nextSibling);
    }

    // Function to select type with validation
    function selectType() {
        selectedType = prompt("Enter the type (80, 100, 120) to fetch data:", "80");
        if (!availableTypes.includes(selectedType)) {
            alert("Invalid type selected. Please enter 80, 100, or 120.");
            selectedType = null;
            return false;
        }
        console.log(`Selected Type: ${selectedType}`); // Debug: Check selected type
        return true;
    }

    // Function to select model with validation
    function selectModel() {
        selectedModel = prompt("Enter the model (model_a, model_b, model_c) to fetch data:", "model_a");
        if (!availableModels.includes(selectedModel)) {
            alert("Invalid model selected. Please enter model_a, model_b, or model_c.");
            selectedModel = null;
            return false;
        }
        console.log(`Selected Model: ${selectedModel}`); // Debug: Check selected model
        return true;
    }

    // Handler function when checkbox changes
    function handleCheckboxChange() {
        const checkedComponents = Array.from(document.querySelectorAll('input[name="components"]:checked')).map(cb => cb.value);
        console.log('Checked Components:', checkedComponents); // Debug: Check checked components

        if (checkedComponents.length > 0) {
            if (!selectType() || !selectModel()) return; // Exit if type or model selection is invalid

            const fetchPromises = checkedComponents.map(component => fetchComponentData(component, selectedType, selectedModel));

            Promise.all(fetchPromises)
                .then(allData => displayComponentData(allData));
        }
    }

    // Add event listeners to checkboxes
    document.querySelectorAll('input[name="components"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
});
