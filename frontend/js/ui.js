// Set up UI event listeners
document.addEventListener('DOMContentLoaded', () => {
    const buildingSelect = document.getElementById('building-select');
    const directionInBtn = document.getElementById('btn-direction-in');
    const directionOutBtn = document.getElementById('btn-direction-out');
    const manualTagIdInput = document.getElementById('manual-tag-id');
    const manualSubmitBtn = document.getElementById('btn-manual-submit');
    const buildingList = document.getElementById('building-list');
    
    // Set initial direction
    currentDirection = 'IN';
    
    // Update current building when selection changes
    buildingSelect.addEventListener('change', (e) => {
        currentBuildingId = e.target.value;
        highlightSelectedBuilding();
        showResult(`Selected building: ${e.target.value}`, 'success');
    });
    
    // Building list click handler (for mobile touch)
    buildingList.addEventListener('click', (e) => {
        const buildingItem = e.target.closest('.building-item');
        if (buildingItem) {
            currentBuildingId = buildingItem.dataset.buildingId;
            buildingSelect.value = currentBuildingId;
            highlightSelectedBuilding();
            showResult(`Selected building: ${currentBuildingId}`, 'success');
        }
    });
    
    // Direction button handlers
    directionInBtn.addEventListener('click', () => {
        setDirection('IN');
    });
    
    directionOutBtn.addEventListener('click', () => {
        setDirection('OUT');
    });
    
    // Manual submission handler
    manualSubmitBtn.addEventListener('click', () => {
        const tagId = manualTagIdInput.value.trim();
        
        if (tagId && /^\d+$/.test(tagId)) {
            processScan(parseInt(tagId));
            manualTagIdInput.value = ''; // Clear input
        } else {
            showResult('Error: Please enter a valid numeric person ID', 'error');
        }
    });
    
    // Allow Enter key to submit manual entry
    manualTagIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            manualSubmitBtn.click();
        }
    });
    
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        
        button.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
    
    // Prevent zoom on select dropdown (iOS fix)
    buildingSelect.addEventListener('touchstart', function(e) {
        if (window.innerWidth <= 480) {
            e.preventDefault();
            this.focus();
            // Force the dropdown to open on iOS
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                setTimeout(() => {
                    this.click();
                }, 10);
            }
        }
    }, { passive: false });
    
    // Improve mobile dropdown experience
    buildingSelect.addEventListener('change', function() {
        // Blur the select to dismiss keyboard on mobile
        if (window.innerWidth <= 480) {
            this.blur();
        }
    });
});

// Set the current direction
function setDirection(direction) {
    const directionInBtn = document.getElementById('btn-direction-in');
    const directionOutBtn = document.getElementById('btn-direction-out');
    
    currentDirection = direction;
    
    if (direction === 'IN') {
        directionInBtn.classList.add('active');
        directionOutBtn.classList.remove('active');
        showResult('Mode: Entry', 'success');
    } else {
        directionInBtn.classList.remove('active');
        directionOutBtn.classList.add('active');
        showResult('Mode: Exit', 'success');
    }
}

// Add PWA features (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Handle mobile app-like behavior
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button if desired
});

// Mobile-specific optimizations
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Add mobile-specific classes for styling
    document.body.classList.add('is-mobile');
    
    // Enhance touch experience
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        select.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
}
// Add this function to detect mobile devices more accurately
function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || 
         (navigator.userAgent.indexOf('IEMobile') !== -1) ||
         (navigator.userAgent.indexOf('Android') !== -1) ||
         (navigator.userAgent.indexOf('iPhone') !== -1) ||
         (navigator.userAgent.indexOf('iPad') !== -1) ||
         (navigator.userAgent.indexOf('iPod') !== -1);
}

// Update the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  // [Previous code remains the same...]
  
  // Mobile-specific optimizations
  if (isMobileDevice()) {
    console.log("Mobile device detected");
    
    // Add mobile class to body for specific styling
    document.body.classList.add('is-mobile');
    
    // Ensure select dropdown is visible and functional
    const buildingSelect = document.getElementById('building-select');
    if (buildingSelect) {
      buildingSelect.style.opacity = "1";
      buildingSelect.style.visibility = "visible";
    }
  }
});