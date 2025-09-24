// API base URL - change this to your backend URL
const API_BASE = 'http://localhost:3001/api';

// DOM elements
const buildingList = document.getElementById('building-list');
const logsContainer = document.getElementById('logs-container');
const buildingSelect = document.getElementById('building-select');
const scanResult = document.getElementById('scan-result');

// Current scan settings
let currentBuildingId = null;
let currentDirection = 'IN';

// Function to fetch and display buildings
async function fetchBuildings() {
    try {
        const response = await fetch(`${API_BASE}/buildings`);
        const buildings = await response.json();
        
        // Update building list
        updateBuildingList(buildings);
        
        // Update select dropdown
        updateBuildingSelect(buildings);
        
    } catch (error) {
        console.error('Error fetching buildings:', error);
        showResult('Error: Could not load buildings', 'error');
        
        // Add sample data for testing
        addSampleBuildings();
    }
}

// Update building list display
function updateBuildingList(buildings) {
    buildingList.innerHTML = '';
    
    buildings.forEach(building => {
        const li = document.createElement('li');
        li.className = 'building-item';
        li.innerHTML = `
            <span>${building.building_id} (${building.dept_name})</span>
            <span class="count">${building.total_count} people</span>
        `;
        buildingList.appendChild(li);
    });
}

// Update building select dropdown
function updateBuildingSelect(buildings) {
    buildingSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a building';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    buildingSelect.appendChild(defaultOption);
    
    // Add building options
    buildings.forEach(building => {
        const option = document.createElement('option');
        option.value = building.building_id;
        option.textContent = `${building.building_id} (${building.dept_name})`;
        buildingSelect.appendChild(option);
    });
}

// Add sample buildings for testing
function addSampleBuildings() {
    const sampleBuildings = [
        { building_id: 'BLDG-A', dept_name: 'Computer Science', total_count: 0 },
        { building_id: 'BLDG-B', dept_name: 'Engineering', total_count: 0 },
        { building_id: 'BLDG-C', dept_name: 'Administration', total_count: 0 }
    ];
    
    updateBuildingList(sampleBuildings);
    updateBuildingSelect(sampleBuildings);
}

// Function to fetch and display logs
async function fetchLogs() {
    try {
        const response = await fetch(`${API_BASE}/scan/logs`);
        const logs = await response.json();
        
        // Update logs container
        updateLogsDisplay(logs);
        
    } catch (error) {
        console.error('Error fetching logs:', error);
        
        // Add sample logs for testing
        addSampleLogs();
    }
}

// Update logs display
function updateLogsDisplay(logs) {
    logsContainer.innerHTML = '';
    
    if (logs.length === 0) {
        logsContainer.innerHTML = '<div class="log-item">No activity yet</div>';
        return;
    }
    
    logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        
        const directionClass = log.direction === 'IN' ? 'direction-in' : 'direction-out';
        
        logItem.innerHTML = `
            <div>
                <span class="${directionClass}">${log.direction}</span> 
                at ${log.building_id} (ID: ${log.tag_id})
            </div>
            <div>${new Date(log.entry_time).toLocaleString()}</div>
        `;
        
        logsContainer.appendChild(logItem);
    });
}

// Add sample logs for testing
function addSampleLogs() {
    const sampleLogs = [
        { direction: 'IN', building_id: 'BLDG-A', tag_id: '1001', entry_time: new Date() },
        { direction: 'OUT', building_id: 'BLDG-A', tag_id: '1002', entry_time: new Date(Date.now() - 300000) }
    ];
    
    updateLogsDisplay(sampleLogs);
}

// Function to process a scan
async function processScan(tagId) {
    if (!currentBuildingId) {
        showResult('Error: Please select a building first', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/scan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                building_id: currentBuildingId,
                direction: currentDirection,
                tag_id: tagId
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            showResult(`Success: ${result.message}`, 'success');
            
            // Refresh data
            fetchBuildings();
            fetchLogs();
        } else {
            // Show error message
            showResult(`Error: ${result.error}`, 'error');
        }
    } catch (error) {
        console.error('Error processing scan:', error);
        showResult('Error: Could not process scan. Using demo mode.', 'warning');
        
        // Simulate success in demo mode
        simulateScanSuccess(tagId);
    }
}

// Simulate scan success for demo purposes
function simulateScanSuccess(tagId) {
    showResult(`Demo: Processed ${currentDirection} for person ${tagId} at ${currentBuildingId}`, 'success');
    
    // Update UI with simulated data
    setTimeout(() => {
        fetchBuildings();
        fetchLogs();
    }, 1000);
}

// Show result message
function showResult(message, type = 'info') {
    const resultElement = document.getElementById('scan-result');
    resultElement.textContent = message;
    resultElement.className = 'scan-result';
    
    if (type === 'error') {
        resultElement.classList.add('error');
    } else if (type === 'success') {
        resultElement.classList.add('success');
    } else if (type === 'warning') {
        resultElement.classList.add('warning');
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (resultElement.textContent === message) {
            resultElement.textContent = '';
            resultElement.className = 'scan-result';
        }
    }, 5000);
}

// Initial data fetch
document.addEventListener('DOMContentLoaded', () => {
    fetchBuildings();
    fetchLogs();
});