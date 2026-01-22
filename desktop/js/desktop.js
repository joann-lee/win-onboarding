// Hotkey: Escape to return to root index
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        window.location.href = '/';
    }
});

// Window Focus Management
let windowZIndex = 2000; // Base z-index for windows

function bringWindowToFront(windowElement) {
    windowZIndex += 1;
    windowElement.style.zIndex = windowZIndex;
}

function setupWindowFocus(windowElement) {
    // Add click listener to bring window to front when clicked
    windowElement.addEventListener('mousedown', () => {
        bringWindowToFront(windowElement);
    });
}

// Copilot Window Functions
function openCopilotWindow() {
    const copilotWindow = document.getElementById('copilotWindow');
    const copilotIcon = document.querySelector('.app-icon.copilot');
    
    // Check if window is already open - if so, dismiss it instantly
    if (copilotWindow.classList.contains('show')) {
        dismissCopilotWindow();
        return;
    }
    
    copilotWindow.style.display = 'block'; // Ensure window is visible
    copilotWindow.classList.remove('hide');
    copilotWindow.classList.add('show');
    
    // Bring to front
    bringWindowToFront(copilotWindow);
    
    // Add active state to Copilot icon
    copilotIcon.classList.add('active');
}

function closeCopilotWindow() {
    const copilotWindow = document.getElementById('copilotWindow');
    const copilotIcon = document.querySelector('.app-icon.copilot');
    
    copilotWindow.classList.remove('show');
    copilotWindow.classList.add('hide');
    
    // Remove active state from Copilot icon
    copilotIcon.classList.remove('active');
    
    // Reset to welcome mode
    resetToWelcomeMode();
    
    // Hide the window completely after animation
    setTimeout(() => {
        copilotWindow.style.display = 'none';
        copilotWindow.classList.remove('hide');
    }, 300);
}

function dismissCopilotWindow() {
    const copilotWindow = document.getElementById('copilotWindow');
    const copilotIcon = document.querySelector('.app-icon.copilot');
    
    // Instant dismiss without animation
    copilotWindow.classList.remove('show');
    copilotWindow.classList.remove('hide');
    copilotWindow.style.display = 'none';
    
    // Remove active state from Copilot icon
    copilotIcon.classList.remove('active');
    
    // Reset to welcome mode
    resetToWelcomeMode();
}

// Teams Window Functions
function openTeamsWindow() {
    const teamsWindow = document.getElementById('teamsWindow');
    const teamsIcon = document.querySelector('.app-icon.teams');
    
    // Check if window is already open - if so, dismiss it instantly
    if (teamsWindow.classList.contains('show')) {
        dismissTeamsWindow();
        return;
    }
    
    teamsWindow.style.display = 'block'; // Ensure window is visible
    teamsWindow.classList.remove('hide');
    teamsWindow.classList.add('show');
    
    // Bring to front
    bringWindowToFront(teamsWindow);
    
    // Add active state to Teams icon
    teamsIcon.classList.add('active');
    
    // Scroll to bottom of messages to show latest messages
    setTimeout(() => {
        const messagesContainer = document.getElementById('teamsMessages');
        if (messagesContainer) {
            console.log('Teams messages container found');
            console.log('Current scrollTop:', messagesContainer.scrollTop);
            console.log('ScrollHeight:', messagesContainer.scrollHeight);
            console.log('ClientHeight:', messagesContainer.clientHeight);
            
            // Force scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            console.log('After scroll - scrollTop:', messagesContainer.scrollTop);
            
            // Force a second scroll after a brief delay
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                console.log('Second scroll - scrollTop:', messagesContainer.scrollTop);
            }, 100);
        } else {
            console.log('Teams messages container NOT found');
        }
    }, 500);
}

function closeTeamsWindow() {
    const teamsWindow = document.getElementById('teamsWindow');
    const teamsIcon = document.querySelector('.app-icon.teams');
    
    teamsWindow.classList.remove('show');
    teamsWindow.classList.add('hide');
    
    // Remove active state from Teams icon
    teamsIcon.classList.remove('active');
    
    // Hide the window completely after animation
    setTimeout(() => {
        teamsWindow.style.display = 'none';
        teamsWindow.classList.remove('hide');
    }, 300);
}

function dismissTeamsWindow() {
    const teamsWindow = document.getElementById('teamsWindow');
    const teamsIcon = document.querySelector('.app-icon.teams');
    
    // Instant dismiss without animation
    teamsWindow.classList.remove('show');
    teamsWindow.classList.remove('hide');
    teamsWindow.style.display = 'none';
    
    // Remove active state from Teams icon
    teamsIcon.classList.remove('active');
}

// Word Window Functions
function openWordWindow() {
    const wordWindow = document.getElementById('wordWindow');
    let wordIcon = document.querySelector('.app-icon.word');
    
    // Check if window is already open - if so, dismiss it instantly
    if (wordWindow.classList.contains('show')) {
        dismissWordWindow();
        return;
    }
    
    // Create Word icon in taskbar if it doesn't exist
    if (!wordIcon) {
        wordIcon = createWordTaskbarIcon();
    }
    
    // Add Project Pluto item to context menu if it doesn't exist
    addProjectPlutoToContextMenu();
    
    wordWindow.style.display = 'block'; // Ensure window is visible
    wordWindow.classList.remove('hide');
    wordWindow.classList.add('show');
    
    // Bring to front
    bringWindowToFront(wordWindow);
    
    // Add active state to Word icon
    if (wordIcon) {
        wordIcon.classList.add('active');
    }
}

function closeWordWindow() {
    const wordWindow = document.getElementById('wordWindow');
    const wordIcon = document.querySelector('.app-icon.word');
    
    wordWindow.classList.remove('show');
    wordWindow.classList.add('hide');
    
    // Remove active state from Word icon
    if (wordIcon) {
        wordIcon.classList.remove('active');
    }
    
    // Hide the window completely after animation
    setTimeout(() => {
        wordWindow.style.display = 'none';
        wordWindow.classList.remove('hide');
        
        // Remove Word icon from taskbar after window is closed
        if (wordIcon) {
            wordIcon.remove();
        }
    }, 300);
}

function dismissWordWindow() {
    const wordWindow = document.getElementById('wordWindow');
    const wordIcon = document.querySelector('.app-icon.word');
    
    // Instant dismiss without animation
    wordWindow.classList.remove('show');
    wordWindow.classList.remove('hide');
    wordWindow.style.display = 'none';
    
    // Remove Word icon from taskbar
    if (wordIcon) {
        wordIcon.remove();
    }
}

function createWordTaskbarIcon() {
    const tasklist = document.querySelector('.tasklist');
    const teamsIcon = document.querySelector('.app-icon.teams');
    
    // Create Word icon element
    const wordIcon = document.createElement('div');
    wordIcon.className = 'app-icon word';
    wordIcon.onclick = openWordWindow;
    
    const img = document.createElement('img');
    img.src = 'Icons/word.svg';
    img.alt = 'Microsoft Word';
    img.className = 'word-icon';
    
    wordIcon.appendChild(img);
    
    // Insert Word icon after Teams icon
    if (teamsIcon && teamsIcon.nextSibling) {
        tasklist.insertBefore(wordIcon, teamsIcon.nextSibling);
    } else {
        tasklist.appendChild(wordIcon);
    }
    
    return wordIcon;
}

function addProjectPlutoToContextMenu() {
    // Check if Project Pluto item already exists
    const existingPlutoItem = document.querySelector('.context-menu-item[data-pluto="true"]');
    if (existingPlutoItem) {
        return; // Already exists, don't add again
    }
    
    const contextMenuContent = document.getElementById('contextMenuContent');
    const recentSection = contextMenuContent.querySelector('.context-menu-recent-section');
    const sectionHeader = contextMenuContent.querySelector('.context-section-header');
    
    // Create the Project Pluto context menu item
    const plutoItem = document.createElement('div');
    plutoItem.className = 'context-menu-item';
    plutoItem.setAttribute('data-pluto', 'true');
    plutoItem.onclick = () => {
        openWordWindow();
        // Close the context menu after opening Word
        hideFileExplorerContextMenu();
    };
    
    plutoItem.innerHTML = `
        <div class="context-item-icon docx-icon">
            <img src="Icons/docx.svg" alt="Word Document" class="action-icon">
        </div>
        <div class="context-item-content">
            <div class="context-item-title">Project Pluto: Working Spec</div>
            <div class="context-item-time">Yesterday • 3:45 PM</div>
        </div>
    `;
    
    // Insert as the first item in the recent section
    if (recentSection.firstChild) {
        recentSection.insertBefore(plutoItem, recentSection.firstChild);
    } else {
        recentSection.appendChild(plutoItem);
    }
}

// Window dragging functionality
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;
let draggedWindow = null;

// Initialize dragging when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Play Windows startup sound
    const startupSound = new Audio('../assets/sound/windows-startup.mp3');
    startupSound.volume = 0.5;
    startupSound.play().catch(e => console.log('Startup sound autoplay blocked:', e));

    const copilotTitleBar = document.querySelector('.title-bar');
    const fileExplorerTitleBar = document.querySelector('.file-explorer-title-bar');
    const teamsDialogTitleBar = document.querySelector('.teams-title-bar');
    const wordTitleBar = document.querySelector('.word-title-bar');
    const copilotWindow = document.getElementById('copilotWindow');
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const teamsWindow = document.getElementById('teamsWindow');
    const wordWindow = document.getElementById('wordWindow');

    // Set up window focus management
    if (copilotWindow) setupWindowFocus(copilotWindow);
    if (fileExplorerWindow) setupWindowFocus(fileExplorerWindow);
    if (teamsWindow) setupWindowFocus(teamsWindow);
    if (wordWindow) setupWindowFocus(wordWindow);

    // Ensure Sarah's latest message is visible
    const messagesContainer = document.getElementById('teamsMessages');
    if (messagesContainer) {
        // Force scroll to bottom to show latest messages
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 500);
    }

    if (copilotTitleBar && copilotWindow) {
        copilotTitleBar.addEventListener('mousedown', (e) => dragStart(e, copilotWindow));
    }
    
    if (fileExplorerTitleBar && fileExplorerWindow) {
        fileExplorerTitleBar.addEventListener('mousedown', (e) => dragStart(e, fileExplorerWindow));
    }
    
    if (teamsDialogTitleBar && teamsWindow) {
        teamsDialogTitleBar.addEventListener('mousedown', (e) => dragStart(e, teamsWindow));
    }
    
    if (wordTitleBar && wordWindow) {
        wordTitleBar.addEventListener('mousedown', (e) => dragStart(e, wordWindow));
    }
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    // Initialize resize functionality
    initializeResize();
    
    // Initialize suggestion cards
    initializeSuggestionCards();
    
    // Initialize input handling
    initializeInputHandling();
    
    // Initialize context menu functionality
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    if (fileExplorerIcon) {
        fileExplorerIcon.addEventListener('contextmenu', showFileExplorerContextMenu);
    }
    
    // Initialize context menu search
    initializeContextMenuSearch();
    
    // Initialize Word comment scroll detection
    initializeWordCommentScrollDetection();
    
    // Initialize File Explorer maximize button
    console.log('Looking for maximize button...'); // Debug log
    const maximizeBtn = document.querySelector('.file-explorer-title-bar .maximize-btn');
    console.log('Maximize button found:', maximizeBtn); // Debug log
    
    if (maximizeBtn) {
        console.log('Adding event listener to maximize button'); // Debug log
        maximizeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Maximize button clicked!'); // Debug log
            morphFileExplorerToContextMenu();
        });
    } else {
        console.error('Maximize button not found!'); // Debug log
    }
    
    // Close context menu when clicking on it
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    if (contextMenu) {
        contextMenu.addEventListener('click', function(event) {
            // Don't close if clicking on action items
            if (!event.target.closest('.action-item')) {
                event.stopPropagation();
            }
        });
    }
});

function dragStart(e, targetWindow) {
    if (e.target.closest('.window-control')) return; // Don't drag if clicking window controls
    
    draggedWindow = targetWindow;
    const rect = targetWindow.getBoundingClientRect();
    
    // Store the initial mouse offset relative to the window's top-left corner
    initialX = e.clientX - rect.left;
    initialY = e.clientY - rect.top;
    
    // Store initial window position for dragging calculations
    windowCenterX = rect.left;
    windowCenterY = rect.top;

    isDragging = true;
    targetWindow.style.cursor = 'grabbing';
}

function dragMove(e) {
    if (isDragging && draggedWindow) {
        e.preventDefault();
        
        // Calculate new position based on mouse position minus initial offset
        const newLeft = e.clientX - initialX;
        const newTop = e.clientY - initialY;
        
        draggedWindow.style.left = newLeft + 'px';
        draggedWindow.style.top = newTop + 'px';
        draggedWindow.style.transform = 'none'; // Remove any transform
    }
}

function dragEnd(e) {
    if (draggedWindow) {
        isDragging = false;
        draggedWindow.style.cursor = 'default';
        
        // Validate position to ensure title bar remains accessible
        validateWindowPosition(draggedWindow);
        
        // Save File Explorer position when dragging ends
        if (draggedWindow.id === 'fileExplorerWindow') {
            const rect = draggedWindow.getBoundingClientRect();
            const position = { left: rect.left, top: rect.top };
            localStorage.setItem('fileExplorerPosition', JSON.stringify(position));
        }
        
        draggedWindow = null;
    }
}

// Window resizing functionality
let isResizing = false;
let resizeDirection = '';
let startX, startY, startWidth, startHeight, startLeft, startTop;

function initializeResize() {
    // Add event listeners to resize handles
    document.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', startResize);
    });

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
}

function startResize(e) {
    e.preventDefault();
    e.stopPropagation(); // Prevent any other event handlers from interfering
    isResizing = true;
    resizeDirection = e.target.getAttribute('data-direction');
    
    startX = e.clientX;
    startY = e.clientY;
    
    // Determine which window is being resized
    let targetWindow;
    if (e.target.closest('.copilot-window')) {
        targetWindow = document.getElementById('copilotWindow');
    } else if (e.target.closest('.file-explorer-window')) {
        targetWindow = document.getElementById('fileExplorerWindow');
    } else if (e.target.closest('.teams-window')) {
        targetWindow = document.getElementById('teamsWindow');
    }
    
    if (!targetWindow) return;
    
    const rect = targetWindow.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left;
    startTop = rect.top;
    
    // Store the target window for use in doResize
    window.currentResizeTarget = targetWindow;
}

function doResize(e) {
    if (!isResizing || !window.currentResizeTarget) return;
    
    const targetWindow = window.currentResizeTarget;
    e.preventDefault();
    
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;
    
    // Handle different resize directions
    if (resizeDirection.includes('e')) {
        newWidth = startWidth + dx;
    }
    if (resizeDirection.includes('w')) {
        newWidth = startWidth - dx;
        newLeft = startLeft + dx;
    }
    if (resizeDirection.includes('s')) {
        newHeight = startHeight + dy;
    }
    if (resizeDirection.includes('n')) {
        newHeight = startHeight - dy;
        newTop = startTop + dy;
    }
    
    // Apply minimum and maximum constraints
    let minWidth, minHeight;
    if (targetWindow.id === 'fileExplorerWindow') {
        // Allow smaller minimum size to enable snap layout behavior
        minWidth = 350; // Allow smaller than context menu width for snap detection
        minHeight = 320; // Allow smaller than context menu height for snap detection
    } else {
        minWidth = 600;
        minHeight = 400;
    }
    
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.90;
    
    // Store original values before constraints for position adjustment
    const originalNewWidth = newWidth;
    const originalNewHeight = newHeight;
    
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    
    // Adjust position when width/height constraints are applied for west/north resizing
    if (resizeDirection.includes('w')) {
        // If width was constrained, adjust the left position accordingly
        const widthDiff = newWidth - originalNewWidth;
        newLeft = newLeft - widthDiff;
    }
    if (resizeDirection.includes('n')) {
        // If height was constrained, adjust the top position accordingly
        const heightDiff = newHeight - originalNewHeight;
        newTop = newTop - heightDiff;
    }
    
    // Update window size and position
    targetWindow.style.width = newWidth + 'px';
    targetWindow.style.height = newHeight + 'px';
    
    if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
        targetWindow.style.left = newLeft + 'px';
        targetWindow.style.top = newTop + 'px';
        targetWindow.style.transform = 'none';
    }
    
    // Check for snap layout behavior for File Explorer
    if (targetWindow.id === 'fileExplorerWindow') {
        checkSnapLayout(targetWindow, newWidth, newHeight);
        updateFileExplorerLayout(targetWindow, newWidth);
        checkMinSizeAutoSnap(targetWindow, newWidth, newHeight);
    }
}

function stopResize() {
    if (window.currentResizeTarget && window.currentResizeTarget.id === 'fileExplorerWindow') {
        // Validate position to ensure title bar remains accessible after resizing
        validateWindowPosition(window.currentResizeTarget);
        
        // Clear minimum size timer when resizing stops
        if (minSizeHoldTimer) {
            clearTimeout(minSizeHoldTimer);
            minSizeHoldTimer = null;
        }
        
        // Check if we should complete the snap to context menu
        const snapTargetBox = document.getElementById('snapTargetBox');
        if (snapTargetBox.classList.contains('active')) {
            morphFileExplorerToContextMenu();
        } else {
            hideSnapTarget();
        }
        
        // Save File Explorer position and size to localStorage
        const rect = window.currentResizeTarget.getBoundingClientRect();
        const position = { left: rect.left, top: rect.top };
        const size = { width: rect.width, height: rect.height };
        
        localStorage.setItem('fileExplorerPosition', JSON.stringify(position));
        localStorage.setItem('fileExplorerSize', JSON.stringify(size));
    }
    
    isResizing = false;
    resizeDirection = '';
    window.currentResizeTarget = null;
}

// Function to update File Explorer layout based on window width
function updateFileExplorerLayout(window, width) {
    // Remove existing width classes
    window.removeAttribute('data-width');
    
    // Apply appropriate width class based on window width
    if (width < 700) {
        window.setAttribute('data-width', 'small');
    } else if (width < 900) {
        window.setAttribute('data-width', 'medium');
    } else {
        window.setAttribute('data-width', 'large');
    }
}

// Snap Layout Functions
function checkSnapLayout(fileExplorerWindow, width, height) {
    const snapTargetBox = document.getElementById('snapTargetBox');
    const contextMenuTargetWidth = 359;
    const contextMenuTargetHeight = 333;
    
    // Check if the window size is approaching the context menu size
    // Use a larger threshold and also check if window is getting smaller
    const sizeThreshold = 150; // Increased threshold for easier detection
    const isApproachingTargetSize = 
        width <= (contextMenuTargetWidth + sizeThreshold) && 
        height <= (contextMenuTargetHeight + sizeThreshold);
    
    // Debug logging (can be removed later)
    console.log(`Window size: ${width}x${height}, Target: ${contextMenuTargetWidth}x${contextMenuTargetHeight}, Approaching: ${isApproachingTargetSize}`);
    
    if (isApproachingTargetSize && !snapTargetBox.classList.contains('visible')) {
        console.log('Showing snap target');
        showSnapTarget();
    } else if (!isApproachingTargetSize && snapTargetBox.classList.contains('visible')) {
        console.log('Hiding snap target');
        hideSnapTarget();
        return;
    }
    
    if (snapTargetBox.classList.contains('visible')) {
        // Check proximity to target position
        const windowRect = fileExplorerWindow.getBoundingClientRect();
        const targetPosition = getContextMenuTargetPosition();
        
        const windowCenterX = windowRect.left + windowRect.width / 2;
        const windowCenterY = windowRect.top + windowRect.height / 2;
        const targetCenterX = targetPosition.x + contextMenuTargetWidth / 2;
        const targetCenterY = targetPosition.y + contextMenuTargetHeight / 2;
        
        const distance = Math.sqrt(
            Math.pow(windowCenterX - targetCenterX, 2) + 
            Math.pow(windowCenterY - targetCenterY, 2)
        );
        
        const snapDistance = 150; // Increased snap distance for easier activation
        
        console.log(`Distance to target: ${distance}, Snap distance: ${snapDistance}`);
        
        if (distance < snapDistance) {
            console.log('Activating snap target');
            snapTargetBox.classList.add('active');
        } else {
            snapTargetBox.classList.remove('active');
        }
    }
}

function getContextMenuTargetPosition() {
    // Get the File Explorer icon position to determine where context menu appears
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    const rect = fileExplorerIcon.getBoundingClientRect();
    const taskbar = document.querySelector('.taskbar');
    const taskbarRect = taskbar.getBoundingClientRect();
    
    const menuWidth = 359;
    const menuHeight = 333;
    
    let x = rect.left + (rect.width / 2) - (menuWidth / 2);
    let y = taskbarRect.top - menuHeight - 8;
    
    // Ensure menu doesn't go off screen
    if (x < 10) x = 10;
    if (x + menuWidth > window.innerWidth - 10) x = window.innerWidth - menuWidth - 10;
    if (y < 10) y = 10;
    
    return { x, y };
}

function showSnapTarget() {
    const snapTargetBox = document.getElementById('snapTargetBox');
    const targetPosition = getContextMenuTargetPosition();
    
    snapTargetBox.style.left = targetPosition.x + 'px';
    snapTargetBox.style.top = targetPosition.y + 'px';
    snapTargetBox.classList.add('visible');
}

function hideSnapTarget() {
    const snapTargetBox = document.getElementById('snapTargetBox');
    snapTargetBox.classList.remove('visible', 'active');
}

function morphFileExplorerToContextMenu() {
    console.log('morphFileExplorerToContextMenu called'); // Debug log
    
    try {
        const fileExplorerWindow = document.getElementById('fileExplorerWindow');
        const contextMenu = document.getElementById('fileExplorerContextMenu');
        const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
        const snapTargetBox = document.getElementById('snapTargetBox');
        
        console.log('Elements found:', { fileExplorerWindow, contextMenu, fileExplorerIcon, snapTargetBox }); // Debug log
        
        if (!fileExplorerWindow || !contextMenu || !fileExplorerIcon) {
            console.error('Required elements not found for morphing');
            return;
        }
    
    // Get current window position and size
    const currentRect = fileExplorerWindow.getBoundingClientRect();
    const targetPosition = getContextMenuTargetPosition();
    
    // Set up File Explorer window for morphing animation
    fileExplorerWindow.classList.add('morphing');
    
    // Set initial position to current position (important for proper morphing)
    fileExplorerWindow.style.position = 'fixed';
    fileExplorerWindow.style.left = currentRect.left + 'px';
    fileExplorerWindow.style.top = currentRect.top + 'px';
    fileExplorerWindow.style.width = currentRect.width + 'px';
    fileExplorerWindow.style.height = currentRect.height + 'px';
    fileExplorerWindow.style.transform = 'none';
    fileExplorerWindow.style.transformOrigin = 'top left';
    
    // Calculate scale to match context menu size
    const scaleX = 359 / currentRect.width;
    const scaleY = 333 / currentRect.height;
    const scale = Math.min(scaleX, scaleY);
    
    // Hide snap target if visible
    if (snapTargetBox) {
        snapTargetBox.classList.remove('visible', 'active');
    }
    
    // Force reflow to ensure styles are applied
    fileExplorerWindow.offsetHeight;
    
    // Animate to target position and scale
    requestAnimationFrame(() => {
        fileExplorerWindow.style.left = targetPosition.x + 'px';
        fileExplorerWindow.style.top = targetPosition.y + 'px';
        fileExplorerWindow.style.transform = `scale(${scale})`;
        fileExplorerWindow.style.opacity = '0.8';
    });
    
    // After animation completes, show context menu and hide File Explorer
    setTimeout(() => {
        // Hide File Explorer window
        fileExplorerWindow.classList.remove('show', 'morphing');
        fileExplorerWindow.style.display = 'none';
        
        // Reset File Explorer window styles to default centered position
        fileExplorerWindow.style.position = 'fixed';
        fileExplorerWindow.style.left = '50%';
        fileExplorerWindow.style.top = '50%';
        fileExplorerWindow.style.width = '900px';
        fileExplorerWindow.style.height = '600px';
        fileExplorerWindow.style.transform = 'translate(-50%, -50%)';
        fileExplorerWindow.style.transformOrigin = '';
        fileExplorerWindow.style.opacity = '';
        
        // Show context menu
        contextMenu.style.left = targetPosition.x + 'px';
        contextMenu.style.top = targetPosition.y + 'px';
        contextMenu.classList.add('visible');
        
        // Keep icon active state but switch to context menu
        fileExplorerIcon.classList.add('active');
        
        // Set up context menu dismissal
        setTimeout(() => {
            document.addEventListener('click', hideFileExplorerContextMenu);
            document.addEventListener('contextmenu', hideFileExplorerContextMenu);
        }, 10);
        
    }, 600); // Match the morphing animation duration
    
    } catch (error) {
        console.error('Error in morphFileExplorerToContextMenu:', error);
    }
}

// Make function globally accessible
window.morphFileExplorerToContextMenu = morphFileExplorerToContextMenu;

// Test function to verify button functionality
window.testMaximizeButton = function() {
    console.log('Test function called - this confirms the script is loaded');
    morphFileExplorerToContextMenu();
};

// Suggestion card functionality
function initializeSuggestionCards() {
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', function() {
            const suggestionText = this.querySelector('.suggestion-text').textContent;
            const input = document.querySelector('.copilot-input');
            
            // Set the input value and trigger chat mode
            input.value = suggestionText;
            switchToChatMode(suggestionText);
        });
    });
}

// Input handling functionality
let isInChatMode = false;

function initializeInputHandling() {
    const copilotInput = document.querySelector('.copilot-input');
    const chatInput = document.querySelector('.chat-input');
    const sendBtn = document.querySelector('.welcome-mode .send-btn');
    const chatSendBtn = document.querySelector('.chat-input-send-btn');
    
    if (copilotInput) {
        // Show/hide send button based on input content
        copilotInput.addEventListener('input', function() {
            if (sendBtn) {
                if (this.value.trim() !== '') {
                    sendBtn.classList.add('show');
                } else {
                    sendBtn.classList.remove('show');
                }
            }
        });
        
        copilotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                switchToChatMode(this.value.trim());
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            const input = document.querySelector('.copilot-input');
            if (input && input.value.trim() !== '') {
                switchToChatMode(input.value.trim());
            }
        });
    }
    
    if (chatInput) {
        // Show/hide send button based on input content
        chatInput.addEventListener('input', function() {
            if (chatSendBtn) {
                if (this.value.trim() !== '') {
                    chatSendBtn.classList.add('show');
                } else {
                    chatSendBtn.classList.remove('show');
                }
            }
        });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim() !== '') {
                sendChatMessage(this.value.trim());
                this.value = '';
                // Hide send button after sending
                if (chatSendBtn) {
                    chatSendBtn.classList.remove('show');
                }
            }
        });
    }
    
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', function() {
            const input = document.querySelector('.chat-input');
            if (input && input.value.trim() !== '') {
                sendChatMessage(input.value.trim());
                input.value = '';
                // Hide send button after sending
                this.classList.remove('show');
            }
        });
    }
}

function switchToChatMode(userMessage) {
    isInChatMode = true;
    
    const welcomeMode = document.querySelector('.welcome-mode');
    const chatMode = document.querySelector('.chat-mode');
    
    // Hide welcome mode
    welcomeMode.style.display = 'none';
    
    // Show chat mode
    chatMode.style.display = 'flex';
    
    // Add the user's message to chat
    addUserMessage(userMessage);
    
    // Generate a response
    setTimeout(() => {
        generateCopilotResponse(userMessage);
    }, 500);
    
    // Focus on chat input
    const chatInput = document.querySelector('.chat-input');
    if (chatInput) {
        chatInput.focus();
    }
}

function addUserMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    
    const userMessageContainer = document.createElement('div');
    userMessageContainer.className = 'user-message';
    
    const messageBubble = document.createElement('div');
    messageBubble.className = 'user-message-bubble';
    
    const messageText = document.createElement('div');
    messageText.className = 'user-message-text';
    messageText.textContent = message;
    
    messageBubble.appendChild(messageText);
    userMessageContainer.appendChild(messageBubble);
    chatMessages.appendChild(userMessageContainer);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateCopilotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Handle PC performance scenario
    if (message.includes('pc') && (message.includes('slow') || message.includes('performance'))) {
        showPerformanceDiagnosis(userMessage);
        return;
    }
    
    const chatMessages = document.querySelector('.chat-messages');
    
    // Create response container
    const responseContainer = document.createElement('div');
    responseContainer.className = 'copilot-response';
    
    // Add Copilot header
    const headerInfo = document.createElement('div');
    headerInfo.className = 'copilot-header-info';
    
    const copilotIcon = document.createElement('div');
    copilotIcon.className = 'copilot-icon-small';
    
    const copilotLabel = document.createElement('div');
    copilotLabel.className = 'copilot-label';
    copilotLabel.textContent = 'Copilot';
    
    headerInfo.appendChild(copilotIcon);
    headerInfo.appendChild(copilotLabel);
    responseContainer.appendChild(headerInfo);
    
    // Add response text
    const responseText = document.createElement('div');
    responseText.className = 'copilot-response-text';
    responseText.textContent = generateResponse(userMessage);
    responseContainer.appendChild(responseText);
    
    // Add source card (optional)
    if (userMessage.toLowerCase().includes('data') || userMessage.toLowerCase().includes('template')) {
        const sourceCard = createSourceCard();
        responseContainer.appendChild(sourceCard);
    }
    
    // Add action buttons
    const actionBar = createActionBar();
    responseContainer.appendChild(actionBar);
    
    chatMessages.appendChild(responseContainer);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateResponse(userMessage) {
    // Simple response generation based on keywords
    const message = userMessage.toLowerCase();
    
    if (message.includes('synthetic data') || message.includes('data')) {
        return `Happy to help. Synthetic data plays a significant role in model training, especially when real-world data is scarce, sensitive, or difficult to obtain. It is artificially generated data that mimics the statistical properties of real data and can be used to train machine learning models. Here is a summary of the key points about the role of synthetic data in model training:

1. **Data Augmentation**: Synthetic data can supplement existing datasets to increase their size and diversity
2. **Privacy Protection**: Helps maintain privacy by not using real personal information
3. **Cost Efficiency**: Reduces the cost and time required to collect real-world data
4. **Bias Mitigation**: Can help create more balanced datasets to reduce algorithmic bias`;
    } else if (message.includes('meeting') || message.includes('calendar')) {
        return `I can help you prepare for your meeting with the marketing team. Based on your calendar, here are some suggestions:

1. Review the agenda and objectives
2. Prepare relevant data and insights
3. Create talking points for key discussion items
4. Set up any necessary presentations or materials

Would you like me to help you with any specific aspect of the meeting preparation?`;
    } else if (message.includes('schedule') || message.includes('tomorrow')) {
        return `Here's what I found on your schedule for tomorrow:

• 9:00 AM - Team standup meeting
• 10:30 AM - Project review with stakeholders  
• 2:00 PM - Marketing strategy discussion
• 4:00 PM - One-on-one with manager

Would you like me to help you prepare for any of these meetings or provide more details about specific appointments?`;
    } else if (message.includes('presentation') || message.includes('quarterly')) {
        return `I can help you create a presentation for the quarterly review. Here's a suggested structure:

1. **Executive Summary** - Key achievements and metrics
2. **Performance Overview** - Quarterly highlights and challenges
3. **Financial Results** - Revenue, costs, and profitability
4. **Strategic Initiatives** - Progress on key projects
5. **Future Outlook** - Goals and priorities for next quarter

Would you like me to help you develop any specific section or gather relevant data for your presentation?`;
    } else {
        return `Thank you for your question. I'm here to help you with various tasks including data analysis, meeting preparation, schedule management, and document creation. Could you provide more specific details about what you'd like assistance with?`;
    }
}

function createSourceCard() {
    const sourceCard = document.createElement('div');
    sourceCard.className = 'source-card';
    
    const sourceEntity = document.createElement('div');
    sourceEntity.className = 'source-entity';
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'source-icon-container';
    
    const sourceIcon = document.createElement('div');
    sourceIcon.className = 'source-icon';
    
    const sourceInfo = document.createElement('div');
    sourceInfo.className = 'source-info';
    
    const sourceTitle = document.createElement('div');
    sourceTitle.className = 'source-title';
    sourceTitle.textContent = '2024-Synthetic data template';
    
    const sourceSubtitle = document.createElement('div');
    sourceSubtitle.className = 'source-subtitle';
    sourceSubtitle.textContent = 'Microsoft Word Document';
    
    const expandBtn = document.createElement('button');
    expandBtn.className = 'source-expand-btn';
    expandBtn.innerHTML = '⤢';
    
    iconContainer.appendChild(sourceIcon);
    sourceInfo.appendChild(sourceTitle);
    sourceInfo.appendChild(sourceSubtitle);
    
    sourceEntity.appendChild(iconContainer);
    sourceEntity.appendChild(sourceInfo);
    sourceEntity.appendChild(expandBtn);
    
    sourceCard.appendChild(sourceEntity);
    
    return sourceCard;
}

function createActionBar() {
    const actionBar = document.createElement('div');
    actionBar.className = 'response-actions';
    
    // Copy button (split)
    const copyBtnGroup = document.createElement('div');
    copyBtnGroup.className = 'action-btn-split';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn action-btn-primary';
    copyBtn.innerHTML = '📋';
    copyBtn.title = 'Copy';
    
    const copyDropdown = document.createElement('button');
    copyDropdown.className = 'action-btn action-btn-secondary';
    copyDropdown.innerHTML = '▼';
    
    copyBtnGroup.appendChild(copyBtn);
    copyBtnGroup.appendChild(copyDropdown);
    
    // Individual action buttons
    const copySimpleBtn = document.createElement('button');
    copySimpleBtn.className = 'action-btn';
    copySimpleBtn.innerHTML = '📄';
    copySimpleBtn.title = 'Copy to clipboard';
    
    const thumbsUpBtn = document.createElement('button');
    thumbsUpBtn.className = 'action-btn';
    thumbsUpBtn.innerHTML = '👍';
    thumbsUpBtn.title = 'Good response';
    
    const thumbsDownBtn = document.createElement('button');
    thumbsDownBtn.className = 'action-btn';
    thumbsDownBtn.innerHTML = '👎';
    thumbsDownBtn.title = 'Poor response';
    
    const moreBtn = document.createElement('button');
    moreBtn.className = 'action-btn';
    moreBtn.innerHTML = '⋯';
    moreBtn.title = 'More options';
    
    actionBar.appendChild(copyBtnGroup);
    actionBar.appendChild(copySimpleBtn);
    actionBar.appendChild(thumbsUpBtn);
    actionBar.appendChild(thumbsDownBtn);
    actionBar.appendChild(moreBtn);
    
    return actionBar;
}

function sendChatMessage(message) {
    addUserMessage(message);
    
    // Generate response after a short delay
    setTimeout(() => {
        generateCopilotResponse(message);
    }, 500);
}

function resetToWelcomeMode() {
    isInChatMode = false;
    
    const welcomeMode = document.querySelector('.welcome-mode');
    const chatMode = document.querySelector('.chat-mode');
    const chatMessages = document.querySelector('.chat-messages');
    const sendBtn = document.querySelector('.welcome-mode .send-btn');
    const chatSendBtn = document.querySelector('.chat-input-send-btn');
    
    // Clear chat messages
    chatMessages.innerHTML = '';
    
    // Hide chat mode
    chatMode.style.display = 'none';
    
    // Show welcome mode
    welcomeMode.style.display = 'flex';
    
    // Clear inputs
    const copilotInput = document.querySelector('.copilot-input');
    const chatInput = document.querySelector('.chat-input');
    
    if (copilotInput) copilotInput.value = '';
    if (chatInput) chatInput.value = '';
    
    // Hide send buttons
    if (sendBtn) sendBtn.classList.remove('show');
    if (chatSendBtn) chatSendBtn.classList.remove('show');
}

// Performance diagnosis functions
function showPerformanceDiagnosis(userMessage) {
    const chatMessages = document.querySelector('.chat-messages');
    
    // Create initial response container with progress
    const responseContainer = document.createElement('div');
    responseContainer.className = 'copilot-response';
    
    // Add Copilot header
    const headerInfo = document.createElement('div');
    headerInfo.className = 'copilot-header-info';
    
    const copilotIcon = document.createElement('div');
    copilotIcon.className = 'copilot-icon-small';
    
    const copilotLabel = document.createElement('div');
    copilotLabel.className = 'copilot-label';
    copilotLabel.textContent = 'Copilot';
    
    headerInfo.appendChild(copilotIcon);
    headerInfo.appendChild(copilotLabel);
    responseContainer.appendChild(headerInfo);
    
    // Initial response
    const initialText = document.createElement('div');
    initialText.className = 'copilot-response-text';
    initialText.textContent = "I'll help you diagnose your PC's performance. Let me run a quick analysis...";
    responseContainer.appendChild(initialText);
    
    // Progress indicator
    const progressContainer = createProgressIndicator();
    responseContainer.appendChild(progressContainer);
    
    chatMessages.appendChild(responseContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate diagnosis process
    setTimeout(() => {
        // Update progress text
        const progressText = progressContainer.querySelector('.progress-text');
        progressText.textContent = 'Analyzing system performance...';
        
        setTimeout(() => {
            progressText.textContent = 'Checking memory usage...';
        }, 1000);
        
        setTimeout(() => {
            progressText.textContent = 'Evaluating disk performance...';
        }, 1500);
        
        setTimeout(() => {
            progressText.textContent = 'Analysis complete!';
            
            // Remove progress indicator and show results
            setTimeout(() => {
                showPerformanceResults(responseContainer);
            }, 500);
        }, 2500);
    }, 1000);
}

function createProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'diagnosis-progress fade-in';
    
    const progressText = document.createElement('div');
    progressText.className = 'progress-text';
    progressText.textContent = 'Starting diagnosis...';
    
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'progress-bar-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progressSteps = document.createElement('div');
    progressSteps.className = 'progress-steps';
    progressSteps.textContent = 'This may take a few moments';
    
    progressBarContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    progressContainer.appendChild(progressBarContainer);
    progressContainer.appendChild(progressSteps);
    
    return progressContainer;
}

function showPerformanceResults(responseContainer) {
    // Remove progress indicator
    const progressContainer = responseContainer.querySelector('.diagnosis-progress');
    if (progressContainer) {
        progressContainer.remove();
    }
    
    // Update response text
    const responseText = responseContainer.querySelector('.copilot-response-text');
    responseText.textContent = "Here's your PC performance analysis:";
    
    // Create performance card
    const performanceCard = createPerformanceCard();
    responseContainer.appendChild(performanceCard);
    
    // Scroll to show results
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createPerformanceCard() {
    const card = document.createElement('div');
    card.className = 'performance-card fade-in';
    
    // Frame 2147233499 - Header and PC Status
    const headerFrame = document.createElement('div');
    headerFrame.className = 'performance-header-frame';
    
    // Frame 2147233501 - Title Frame
    const titleFrame = document.createElement('div');
    titleFrame.className = 'performance-title-frame';
    
    const title = document.createElement('div');
    title.className = 'performance-title';
    title.textContent = 'PC Performance';
    
    titleFrame.appendChild(title);
    headerFrame.appendChild(titleFrame);
    
    // PC Status Container
    const pcStatusContainer = document.createElement('div');
    pcStatusContainer.className = 'pc-status-container';
    
    // PC Thumbnail
    const pcThumbnail = document.createElement('div');
    pcThumbnail.className = 'pc-thumbnail';
    
    // PC Bezel Shadow
    const pcBezelShadow = document.createElement('div');
    pcBezelShadow.className = 'pc-bezel-shadow';
    
    // PC Bezel Base
    const pcBezelBase = document.createElement('div');
    pcBezelBase.className = 'pc-bezel-base';
    
    // PC Screen Mask
    const pcScreenMask = document.createElement('div');
    pcScreenMask.className = 'pc-screen-mask';
    
    pcThumbnail.appendChild(pcBezelShadow);
    pcThumbnail.appendChild(pcBezelBase);
    pcThumbnail.appendChild(pcScreenMask);
    pcStatusContainer.appendChild(pcThumbnail);
    
    // Value Banner Text Container
    const valueBannerText = document.createElement('div');
    valueBannerText.className = 'value-banner-text';
    pcStatusContainer.appendChild(valueBannerText);
    
    // Device Name
    const deviceName = document.createElement('div');
    deviceName.className = 'device-name';
    deviceName.textContent = 'DESKTOP-ABC123';
    pcStatusContainer.appendChild(deviceName);
    
    // Performance Score
    const performanceScore = document.createElement('div');
    performanceScore.className = 'performance-score';
    performanceScore.textContent = '43%';
    pcStatusContainer.appendChild(performanceScore);
    
    // Performance Bar Container
    const performanceBarContainer = document.createElement('div');
    performanceBarContainer.className = 'performance-bar-container';
    
    // Performance Bar Background
    const performanceBarBg = document.createElement('div');
    performanceBarBg.className = 'performance-bar-bg';
    
    // Performance Bar Fill
    const performanceBar = document.createElement('div');
    performanceBar.className = 'performance-bar';
    
    performanceBarContainer.appendChild(performanceBarBg);
    performanceBarContainer.appendChild(performanceBar);
    pcStatusContainer.appendChild(performanceBarContainer);
    
    // Performance Tag
    const performanceTag = document.createElement('div');
    performanceTag.className = 'performance-tag';
    
    const performanceTagText = document.createElement('div');
    performanceTagText.className = 'performance-tag-text';
    performanceTagText.textContent = 'Medium low';
    
    performanceTag.appendChild(performanceTagText);
    pcStatusContainer.appendChild(performanceTag);
    
    headerFrame.appendChild(pcStatusContainer);
    
    // Divider
    const divider = document.createElement('div');
    divider.className = 'performance-divider';
    
    const dividerLine = document.createElement('div');
    dividerLine.className = 'performance-divider-line';
    
    divider.appendChild(dividerLine);
    
    // Recommendations Frame
    const recommendationsFrame = document.createElement('div');
    recommendationsFrame.className = 'performance-recommendations-frame';
    
    const recommendationsTitle = document.createElement('div');
    recommendationsTitle.className = 'recommendations-title';
    recommendationsTitle.textContent = 'Recommended actions';
    
    const recommendationsParagraph = document.createElement('div');
    recommendationsParagraph.className = 'recommendations-paragraph';
    recommendationsParagraph.textContent = 'Free up disk space (12 GB available), update 3 outdated drivers, and run disk cleanup utility to improve performance.';
    
    recommendationsFrame.appendChild(recommendationsTitle);
    recommendationsFrame.appendChild(recommendationsParagraph);
    
    // Assemble the card
    card.appendChild(headerFrame);
    card.appendChild(divider);
    card.appendChild(recommendationsFrame);
    
    return card;
}

// Handle maximize button click
function handleMaximizeClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Maximize button clicked via event listener!');
    morphFileExplorerToContextMenu();
}

// File Explorer Window Functions
function openFileExplorerWindow() {
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    
    // Check if context menu is open - if so, close it and go to inactive state
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    if (contextMenu.classList.contains('visible')) {
        hideFileExplorerContextMenu();
        return;
    }
    
    // Check if window is minimized - if so, restore it
    if (fileExplorerWindow.classList.contains('minimized')) {
        fileExplorerWindow.style.display = 'block';
        fileExplorerWindow.classList.remove('minimized');
        fileExplorerWindow.classList.remove('running');
        fileExplorerWindow.classList.add('show');
        fileExplorerIcon.classList.remove('running');
        fileExplorerIcon.classList.add('active');
        return;
    }
    
    // Check if window is already open - if so, dismiss it instantly
    if (fileExplorerWindow.classList.contains('show')) {
        dismissFileExplorerWindow();
        return;
    }
    
    // Restore last position and size BEFORE making window visible
    const savedPosition = localStorage.getItem('fileExplorerPosition');
    const savedSize = localStorage.getItem('fileExplorerSize');
    
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        fileExplorerWindow.style.left = position.left + 'px';
        fileExplorerWindow.style.top = position.top + 'px';
    }
    
    if (savedSize) {
        const size = JSON.parse(savedSize);
        fileExplorerWindow.style.width = size.width + 'px';
        fileExplorerWindow.style.height = size.height + 'px';
    }
    
    // Validate position to ensure title bar is always accessible
    validateWindowPosition(fileExplorerWindow);
    
    fileExplorerWindow.style.display = 'block'; // Ensure window is visible
    fileExplorerWindow.classList.remove('hide');
    
    fileExplorerWindow.classList.add('show');
    
    // Bring to front
    bringWindowToFront(fileExplorerWindow);
    
    // Add active state to File Explorer icon
    fileExplorerIcon.classList.add('active');
    
    // Initialize maximize button event listener (ensure it's attached)
    const maximizeBtn = fileExplorerWindow.querySelector('.maximize-btn');
    if (maximizeBtn) {
        // Remove any existing listeners to avoid duplicates
        maximizeBtn.removeEventListener('click', handleMaximizeClick);
        // Add the event listener
        maximizeBtn.addEventListener('click', handleMaximizeClick);
        console.log('Maximize button event listener attached in openFileExplorerWindow');
    } else {
        console.error('Maximize button not found in openFileExplorerWindow');
    }
    
    // Initialize responsive layout
    const rect = fileExplorerWindow.getBoundingClientRect();
    updateFileExplorerLayout(fileExplorerWindow, rect.width);
}

function morphContextMenuToFileExplorer() {
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    
    // Get current context menu position and size
    const contextRect = contextMenu.getBoundingClientRect();
    
    // Calculate final window dimensions
    const finalWidth = 900;
    const finalHeight = 600;
    
    // Use saved position if available, otherwise position near context menu
    const savedPosition = localStorage.getItem('fileExplorerPosition');
    let finalLeft, finalTop;
    
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        finalLeft = position.left;
        finalTop = position.top;
    } else {
        // Keep the window positioned at the context menu location - no centering
        finalLeft = Math.max(20, Math.min(contextRect.left, window.innerWidth - finalWidth - 20));
        finalTop = Math.max(20, Math.min(contextRect.top, window.innerHeight - finalHeight - 20));
    }
    
    // Apply saved size if available
    const savedSize = localStorage.getItem('fileExplorerSize');
    let actualWidth = finalWidth;
    let actualHeight = finalHeight;
    
    if (savedSize) {
        const size = JSON.parse(savedSize);
        actualWidth = size.width;
        actualHeight = size.height;
    }
    
    // Validate final position to ensure title bar accessibility
    const tempElement = document.createElement('div');
    tempElement.style.position = 'fixed';
    tempElement.style.left = finalLeft + 'px';
    tempElement.style.top = finalTop + 'px';
    tempElement.style.width = actualWidth + 'px';
    tempElement.style.height = actualHeight + 'px';
    document.body.appendChild(tempElement);
    validateWindowPosition(tempElement);
    finalLeft = parseFloat(tempElement.style.left);
    finalTop = parseFloat(tempElement.style.top);
    document.body.removeChild(tempElement);
    
    // Calculate initial scale to match context menu size
    const initialScale = Math.min(contextRect.width / actualWidth, contextRect.height / actualHeight);
    
    // Setup File Explorer window for morphing - disable transitions first
    fileExplorerWindow.style.transition = 'none';
    fileExplorerWindow.style.position = 'fixed';
    fileExplorerWindow.style.left = `${contextRect.left}px`;
    fileExplorerWindow.style.top = `${contextRect.top}px`;
    fileExplorerWindow.style.width = `${actualWidth}px`;
    fileExplorerWindow.style.height = `${actualHeight}px`;
    fileExplorerWindow.style.transformOrigin = 'top left';
    fileExplorerWindow.style.transform = `scale(${initialScale})`;
    fileExplorerWindow.style.opacity = '0.8';
    
    // Now make the window visible with all styles already applied
    fileExplorerWindow.style.display = 'block';
    
    // Hide context menu immediately to avoid overlap
    contextMenu.style.opacity = '0';
    
    // Add active state to File Explorer icon
    fileExplorerIcon.classList.add('active');
    
    // Force reflow to ensure all styles are applied
    fileExplorerWindow.offsetHeight;
    
    // Now enable transitions and add morphing class for the animation
    fileExplorerWindow.classList.add('morphing');
    
    // Start morphing animation
    requestAnimationFrame(() => {
        // Animate to final size and position
        fileExplorerWindow.style.left = `${finalLeft}px`;
        fileExplorerWindow.style.top = `${finalTop}px`;
        fileExplorerWindow.style.transform = 'scale(1)';
        fileExplorerWindow.style.opacity = '1';
        
        // Complete context menu hiding
        setTimeout(() => {
            hideFileExplorerContextMenu();
        }, 100);
        
        // Clean up morphing styles after animation
        setTimeout(() => {
            fileExplorerWindow.classList.remove('morphing');
            fileExplorerWindow.classList.add('show');
            
            // Keep absolute positioning - don't reset to centered
            fileExplorerWindow.style.position = 'fixed';
            // Don't override the final position - keep the saved position
            fileExplorerWindow.style.transform = 'none';
            fileExplorerWindow.style.height = '';
            fileExplorerWindow.style.transformOrigin = '';
            fileExplorerWindow.style.transition = ''; // Reset transition to CSS default
            
            // Initialize responsive layout
            const rect = fileExplorerWindow.getBoundingClientRect();
            updateFileExplorerLayout(fileExplorerWindow, rect.width);
        }, 600);
    });
}

function closeFileExplorerWindow() {
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    
    // Hide snap target if visible
    hideSnapTarget();
    
    // Use original fade-out animation for close (not shrinking)
    fileExplorerWindow.classList.remove('show');
    fileExplorerWindow.classList.add('hide');
    
    // Remove active state from File Explorer icon
    fileExplorerIcon.classList.remove('active');
    fileExplorerIcon.classList.remove('running');
    
    // Reset context menu state to ensure it can be shown again
    contextMenu.style.opacity = '';
    contextMenu.style.transition = '';
    contextMenu.classList.remove('visible');
    
    // Hide the window completely after animation (300ms for fade-out animation)
    setTimeout(() => {
        fileExplorerWindow.style.display = 'none';
        fileExplorerWindow.classList.remove('hide');
        fileExplorerWindow.classList.remove('running');
        fileExplorerWindow.classList.remove('minimized');
    }, 300);
}

function minimizeFileExplorerWindow() {
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    
    // Hide snap target if visible
    hideSnapTarget();
    
    // Use shrinking animation for minimize
    fileExplorerWindow.classList.remove('show');
    fileExplorerWindow.classList.add('shrink');
    
    // Change from active to running state (minimized, not closed)
    fileExplorerIcon.classList.remove('active');
    fileExplorerIcon.classList.add('running');
    
    // Reset context menu state
    contextMenu.style.opacity = '';
    contextMenu.style.transition = '';
    contextMenu.classList.remove('visible');
    
    // Hide the window completely after animation, but keep it minimized (can be restored)
    setTimeout(() => {
        fileExplorerWindow.style.display = 'none';
        fileExplorerWindow.classList.remove('shrink');
        // Add minimized and running classes to track state
        fileExplorerWindow.classList.add('minimized');
        fileExplorerWindow.classList.add('running');
    }, 600);
}

function dismissFileExplorerWindow() {
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    
    // Hide snap target if visible
    hideSnapTarget();
    
    // Instant dismiss without animation
    fileExplorerWindow.classList.remove('show');
    fileExplorerWindow.classList.remove('hide');
    fileExplorerWindow.style.display = 'none';
    
    // Remove active state from File Explorer icon
    fileExplorerIcon.classList.remove('active');
}

// File Explorer File Selection and Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for file items
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selection from all items
            fileItems.forEach(i => i.classList.remove('selected'));
            // Add selection to clicked item
            this.classList.add('selected');
        });
        
        item.addEventListener('dblclick', function() {
            if (this.classList.contains('folder')) {
                // Simulate folder navigation
                console.log('Opening folder:', this.querySelector('.file-name').textContent);
            } else {
                // Simulate file opening
                console.log('Opening file:', this.querySelector('.file-name').textContent);
            }
        });
    });
    
    // Add event listeners for sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const homeView = document.querySelector('.home-view');
    const fileGrid = document.querySelector('.file-grid');
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selection from all sidebar items
            sidebarItems.forEach(i => i.classList.remove('selected'));
            // Add selection to clicked item
            this.classList.add('selected');
            
            // Check if Home item was clicked
            const itemText = this.textContent.trim();
            if (itemText.includes('Home') || this.querySelector('.home-icon')) {
                // Show Home view, hide file grid
                homeView.style.display = 'block';
                fileGrid.style.display = 'none';
                console.log('Navigating to: Home');
                
                // Update breadcrumb
                updateBreadcrumb('Home');
            } else {
                // Show file grid, hide Home view
                homeView.style.display = 'none';
                fileGrid.style.display = 'grid';
                console.log('Navigating to:', itemText);
                
                // Update breadcrumb
                updateBreadcrumb('This PC', itemText);
            }
        });
    });
    
    // Tab functionality for Home view
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            console.log('Switched to tab:', tabType);
            // Here you could add logic to show different content for each tab
        });
    });
});

// Function to update breadcrumb
function updateBreadcrumb(primary, secondary = null) {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        if (secondary) {
            breadcrumb.innerHTML = `
                <span class="breadcrumb-item">${primary}</span>
                <span class="breadcrumb-separator">></span>
                <span class="breadcrumb-item">${secondary}</span>
            `;
        } else {
            breadcrumb.innerHTML = `<span class="breadcrumb-item">${primary}</span>`;
        }
    }
}

// File Explorer Context Menu Functions
function showFileExplorerContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    const rect = event.currentTarget.getBoundingClientRect();
    
    // Add active state to File Explorer icon when context menu opens
    fileExplorerIcon.classList.add('active');
    
    // Position the context menu above the File Explorer icon
    const menuWidth = 359;
    const menuHeight = 333; // Actual content height excluding drop shadow
    
    // Get actual taskbar element to measure its height
    const taskbar = document.querySelector('.taskbar');
    const taskbarRect = taskbar.getBoundingClientRect();
    const actualTaskbarHeight = taskbarRect.height;
    
    // Calculate position (8px gap above the taskbar)
    let x = rect.left + (rect.width / 2) - (menuWidth / 2);
    let y = taskbarRect.top - menuHeight - 8;
    
    // Ensure menu doesn't go off screen
    if (x < 10) x = 10;
    if (x + menuWidth > window.innerWidth - 10) x = window.innerWidth - menuWidth - 10;
    if (y < 10) y = 10;
    
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    contextMenu.classList.add('visible');
    
    // Close context menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', hideFileExplorerContextMenu);
        document.addEventListener('contextmenu', hideFileExplorerContextMenu);
    }, 10);
}

function hideFileExplorerContextMenu() {
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    
    contextMenu.classList.remove('visible');
    
    // Remove active state from File Explorer icon when context menu closes
    fileExplorerIcon.classList.remove('active');
    
    // Reset all inline styles that might interfere with future displays
    contextMenu.style.opacity = '';
    contextMenu.style.transition = '';
    
    // Clean up search state when hiding context menu
    resetContextMenuSearchState();
    
    // Remove event listeners
    document.removeEventListener('click', hideFileExplorerContextMenu);
    document.removeEventListener('contextmenu', hideFileExplorerContextMenu);
}

// Prevent default right-click on app icons to show custom context menu
// Context menu functionality is initialized in the main DOMContentLoaded listener above

// Utility function to ensure window title bar is always accessible
function validateWindowPosition(windowElement) {
    const rect = windowElement.getBoundingClientRect();
    const titleBarHeight = 32; // Height of the title bar
    const minVisibleTitleBar = 20; // Minimum pixels of title bar that should be visible
    
    let newLeft = parseFloat(windowElement.style.left) || rect.left;
    let newTop = parseFloat(windowElement.style.top) || rect.top;
    
    // Ensure title bar is not above the screen
    if (newTop < 0) {
        newTop = 10; // Small margin from top
    }
    
    // Ensure title bar is not below the taskbar (assuming taskbar is at bottom)
    const maxTop = window.innerHeight - titleBarHeight - 40; // 40px for taskbar + margin
    if (newTop > maxTop) {
        newTop = maxTop;
    }
    
    // Ensure at least part of the window is visible horizontally
    const windowWidth = rect.width;
    const minLeft = -windowWidth + 100; // Allow dragging mostly off-screen but keep 100px visible
    const maxLeft = window.innerWidth - 100; // Keep at least 100px visible on the right
    
    if (newLeft < minLeft) {
        newLeft = minLeft;
    } else if (newLeft > maxLeft) {
        newLeft = maxLeft;
    }
    
    // Apply the validated position
    windowElement.style.left = newLeft + 'px';
    windowElement.style.top = newTop + 'px';
    windowElement.style.transform = 'none';
}

// Auto-snap to taskbar functionality
let minSizeHoldTimer = null;
let isAtMinSize = false;

// Function to check and handle minimum size auto-snap behavior
function checkMinSizeAutoSnap(targetWindow, width, height) {
    const minWidth = 350;
    const minHeight = 320;
    
    // Check if window is at minimum size
    const isCurrentlyAtMinSize = (width <= minWidth && height <= minHeight);
    
    if (isCurrentlyAtMinSize && !isAtMinSize) {
        // Just reached minimum size - show acrylic effect then snap to taskbar position
        isAtMinSize = true;
        console.log('Window reached minimum size - starting acrylic effect and snap');
        showAcrylicEffectAndSnap(targetWindow);
        
        // Start 2-second timer for auto-morph to context menu
        minSizeHoldTimer = setTimeout(() => {
            if (isAtMinSize) {
                console.log('Timer expired - morphing to context menu');
                morphFileExplorerToContextMenu();
            }
        }, 2000);
        
    } else if (!isCurrentlyAtMinSize && isAtMinSize) {
        // No longer at minimum size - cancel the timer
        console.log('Window no longer at minimum size - canceling timer');
        isAtMinSize = false;
        if (minSizeHoldTimer) {
            clearTimeout(minSizeHoldTimer);
            minSizeHoldTimer = null;
        }
    }
}

// Function to show acrylic effect and then snap to taskbar position
function showAcrylicEffectAndSnap(targetWindow) {
    console.log('Starting acrylic effect and snap animation');
    
    // Add acrylic effect class to the window
    targetWindow.classList.add('acrylic-docking');
    
    // Show a subtle glow effect on the taskbar icon to indicate the target
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    if (fileExplorerIcon) {
        fileExplorerIcon.style.boxShadow = '0 0 20px rgba(0, 120, 215, 0.6)';
        fileExplorerIcon.style.transition = 'box-shadow 0.3s ease';
    }
    
    // Apply initial acrylic styling with enhanced effects
    targetWindow.style.backdropFilter = 'blur(20px) saturate(1.8)';
    targetWindow.style.webkitBackdropFilter = 'blur(20px) saturate(1.8)';
    targetWindow.style.background = 'rgba(243, 243, 243, 0.75)';
    targetWindow.style.border = '1px solid rgba(255, 255, 255, 0.4)';
    targetWindow.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)';
    targetWindow.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    // Add a subtle scale effect to draw attention
    targetWindow.style.transform = 'scale(1.02)';
    
    // Show the acrylic effect for a brief moment
    setTimeout(() => {
        console.log('Acrylic effect complete - starting snap to taskbar');
        // Reset the scale before snapping
        targetWindow.style.transform = 'scale(1)';
        
        // Now animate to the taskbar position after a brief delay
        setTimeout(() => {
            snapToTaskbarPosition(targetWindow);
            
            // Remove taskbar icon glow after snapping starts
            if (fileExplorerIcon) {
                fileExplorerIcon.style.boxShadow = '';
                fileExplorerIcon.style.transition = '';
            }
            
            // Remove acrylic effect after snapping animation completes
            setTimeout(() => {
                targetWindow.classList.remove('acrylic-docking');
                targetWindow.style.backdropFilter = '';
                targetWindow.style.webkitBackdropFilter = '';
                targetWindow.style.background = '';
                targetWindow.style.border = '';
                targetWindow.style.boxShadow = '';
                console.log('Snap animation complete - window ready for context menu morph');
            }, 400); // Match the snap animation duration
            
        }, 100); // Small delay before starting the snap
        
    }, 400); // Show acrylic for 400ms before snapping
}

// Function to snap window to taskbar position
function snapToTaskbarPosition(targetWindow) {
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    const iconRect = fileExplorerIcon.getBoundingClientRect();
    
    // Position window above the taskbar icon (context menu position)
    const contextMenuWidth = 359;
    const contextMenuHeight = 333;
    const taskbarHeight = 48; // Approximate taskbar height
    
    let newLeft = iconRect.left + (iconRect.width / 2) - (contextMenuWidth / 2);
    let newTop = window.innerHeight - taskbarHeight - contextMenuHeight - 10; // 10px margin
    
    // Ensure the window doesn't go off screen
    if (newLeft < 10) newLeft = 10;
    if (newLeft + contextMenuWidth > window.innerWidth - 10) {
        newLeft = window.innerWidth - contextMenuWidth - 10;
    }
    
    // Enhanced animation with smooth easing
    targetWindow.style.transition = 'left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    targetWindow.style.left = newLeft + 'px';
    targetWindow.style.top = newTop + 'px';
    
    // Add a subtle scale effect to indicate docking
    targetWindow.style.transform = 'scale(0.98)';
    
    // Reset styles after animation
    setTimeout(() => {
        targetWindow.style.transition = '';
        targetWindow.style.transform = '';
    }, 400);
}

// Function to morph File Explorer window to context menu
function morphFileExplorerToContextMenu() {
    const fileExplorerWindow = document.getElementById('fileExplorerWindow');
    const contextMenu = document.getElementById('fileExplorerContextMenu');
    const fileExplorerIcon = document.querySelector('.app-icon.file-explorer');
    
    if (!fileExplorerWindow || !contextMenu) return;
    
    // Get current window position and size
    const windowRect = fileExplorerWindow.getBoundingClientRect();
    
    // Calculate target context menu position
    const iconRect = fileExplorerIcon.getBoundingClientRect();
    const menuWidth = 359;
    const menuHeight = 333;
    const taskbar = document.querySelector('.taskbar');
    const taskbarRect = taskbar.getBoundingClientRect();
    
    let targetLeft = iconRect.left + (iconRect.width / 2) - (menuWidth / 2);
    let targetTop = taskbarRect.top - menuHeight - 8;
    
    // Ensure menu doesn't go off screen
    if (targetLeft < 10) targetLeft = 10;
    if (targetLeft + menuWidth > window.innerWidth - 10) {
        targetLeft = window.innerWidth - menuWidth - 10;
    }
    if (targetTop < 10) targetTop = 10;
    
    // Calculate scale to shrink to context menu size
    const scaleX = menuWidth / windowRect.width;
    const scaleY = menuHeight / windowRect.height;
    const scale = Math.min(scaleX, scaleY);
    
    // Add morphing class for styling
    fileExplorerWindow.classList.add('morphing-to-context');
    
    // Apply morphing animation
    fileExplorerWindow.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    fileExplorerWindow.style.transform = `scale(${scale})`;
    fileExplorerWindow.style.left = targetLeft + 'px';
    fileExplorerWindow.style.top = targetTop + 'px';
    fileExplorerWindow.style.opacity = '0.8';
    
    // After animation completes, hide window and show context menu
    setTimeout(() => {
        // Hide the File Explorer window
        fileExplorerWindow.style.display = 'none';
        fileExplorerWindow.classList.remove('morphing-to-context');
        fileExplorerWindow.style.transition = '';
        fileExplorerWindow.style.transform = '';
        fileExplorerWindow.style.opacity = '';
        
        // Reset min size tracking
        isAtMinSize = false;
        if (minSizeHoldTimer) {
            clearTimeout(minSizeHoldTimer);
            minSizeHoldTimer = null;
        }
        
        // Show context menu at the target position
        contextMenu.style.left = targetLeft + 'px';
        contextMenu.style.top = targetTop + 'px';
        contextMenu.classList.add('visible');
        
        // Keep File Explorer icon active since context menu is now open
        fileExplorerIcon.classList.add('active');
        
        // Add event listeners to close context menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', hideFileExplorerContextMenu);
            document.addEventListener('contextmenu', hideFileExplorerContextMenu);
        }, 10);
        
    }, 600);
}

// File Explorer Context Menu Search Functionality
let searchResultsData = [
    {
        name: "Project Pluto: Working Spec",
        type: "docx",
        icon: "Icons/docx.svg",
        date: "Yesterday",
        time: "3:45 PM",
        reason: "Title contains matching characters",
        keywords: ["pluto", "project", "spec", "working", "document", "proj"]
    },
    {
        name: "Pluto Design Assets",
        type: "folder",
        icon: "📁",
        date: "2 days ago",
        time: "11:30 AM",
        reason: "Title contains matching characters",
        keywords: ["pluto", "design", "assets", "folder", "graphics"]
    },
    {
        name: "Pluto Meeting Notes",
        type: "txt",
        icon: "📄",
        date: "3 days ago",
        time: "2:15 PM",
        reason: "Related to current project",
        keywords: ["pluto", "meeting", "notes", "text", "discussion"]
    },
    {
        name: "Agenda 7/12",
        type: "loop",
        icon: "Icons/loop.svg",
        date: "1 week ago",
        time: "9:00 AM",
        reason: "Notes contain matching characters",
        keywords: ["agenda", "pluto", "meeting", "notes", "discussion", "july"]
    },
    // Arc-related search results
    {
        name: "Vision 2.0",
        type: "pptx",
        icon: "Icons/pptx.svg",
        date: "3 days ago",
        time: "10:30 AM",
        reason: "Contains matching characters",
        keywords: ["arc", "vision", "design", "presentation", "ppt", "powerpoint"],
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIHJ4PSI4IiBmaWxsPSIjRjNFOUZGIi8+PHRleHQgeD0iNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY0NEIzIiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIj5EZXNpZ24gVmlzaW9uPC90ZXh0Pjx0ZXh0IHg9IjUwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5ODhCMyIgZm9udC1zaXplPSI4IiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIj5WaXNpb24gMi4wPC90ZXh0Pjwvc3ZnPg==",
        isSpecialArcResult: true
    },
    {
        name: "Arc North Star",
        type: "pptx", 
        icon: "Icons/pptx.svg",
        date: "1 week ago",
        time: "2:15 PM",
        reason: "Related to project",
        keywords: ["arc", "north", "star", "design", "presentation", "ppt", "powerpoint"],
        thumbnail: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iODAiIHJ4PSI4IiBmaWxsPSIjMjMyMzIzIi8+PHRleHQgeD0iNTAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjEwIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIj5BUkM8L3RleHQ+PHRleHQgeD0iNTAiIHk9IjQ1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjgiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFNlZ29lIFVJLCBSb2JvdG8sIHNhbnMtc2VyaWYiPk5vcnRoIFN0YXI8L3RleHQ+PHRleHQgeD0iNTAiIHk9IjU4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LXNpemU9IjYiIGZvbnQtZmFtaWx5PSItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIFNlZ29lIFVJLCBSb2JvdG8sIHNhbnMtc2VyaWYiPkRlc2lnbiBQcmVzZW50YXRpb248L3RleHQ+PC9zdmc+",
        isSpecialArcResult: true
    },
    {
        name: "Arc Marketing Compendium",
        type: "pptx",
        icon: "Icons/pptx.svg", 
        date: "1h ago",
        time: "",
        reason: "",
        keywords: ["arc", "marketing", "compendium", "presentation", "ppt", "powerpoint"]
    },
    {
        name: "UXR Study May 2025 Arc Diar...",
        type: "pptx",
        icon: "Icons/pptx.svg",
        date: "1mo ago", 
        time: "",
        reason: "",
        keywords: ["arc", "uxr", "study", "diary", "research", "presentation", "ppt", "powerpoint"]
    }
];

function initializeContextMenuSearch() {
    const searchInput = document.getElementById('contextSearchInput');
    const searchResultsDiv = document.getElementById('contextSearchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const contextMenuContent = document.getElementById('contextMenuContent');
    const contextMenuActions = document.getElementById('contextMenuActions');
    
    if (!searchInput) return;
    
    // Initialize global timeout variable
    window.contextSearchTimeout = null;
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        
        // Clear previous timeout
        clearTimeout(window.contextSearchTimeout);
        
        if (query.length === 0) {
            // Clear search results completely
            searchResultsContainer.innerHTML = '';
            
            // Hide search results and show recent files + actions
            searchResultsDiv.style.display = 'none';
            contextMenuContent.style.display = 'block';
            contextMenuContent.style.visibility = 'visible'; // Restore visibility
            contextMenuActions.style.display = 'block';
            contextMenuActions.style.visibility = 'visible'; // Restore visibility
            
            // Reset any animation classes or states
            setTimeout(() => {
                searchResultsContainer.classList.remove('searching');
            }, 0);
            
            return;
        }
        
        // Add delay to simulate real search behavior
        window.contextSearchTimeout = setTimeout(() => {
            performContextSearch(query);
        }, 200);
    });
}

function performContextSearch(query) {
    const searchResultsDiv = document.getElementById('contextSearchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const contextMenuContent = document.getElementById('contextMenuContent');
    const contextMenuActions = document.getElementById('contextMenuActions');
    
    // Clear any existing search state
    clearTimeout(window.contextSearchTimeout);
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.classList.remove('searching');
    
    // Check if this is an Arc-related search
    const isArcSearch = query.includes('arc') || 
                       query.includes('arc design') || 
                       query.includes('arc ppt') || 
                       query.includes('ppt design') || 
                       query.includes('design');
    
    // Filter results based on query
    const matchingResults = searchResultsData.filter(result => {
        // For multi-word queries, check if all words match
        const queryWords = query.split(' ');
        return queryWords.every(word => 
            result.keywords.some(keyword => keyword.includes(word))
        );
    });
    
    // Sort by relevance (how many keywords match)
    matchingResults.sort((a, b) => {
        const queryWords = query.split(' ');
        const aMatches = queryWords.reduce((count, word) => {
            return count + a.keywords.filter(keyword => keyword.includes(word)).length;
        }, 0);
        const bMatches = queryWords.reduce((count, word) => {
            return count + b.keywords.filter(keyword => keyword.includes(word)).length;
        }, 0);
        return bMatches - aMatches;
    });
    
    if (matchingResults.length > 0) {
        // Show search results, hide recent files and actions
        searchResultsDiv.style.display = 'block';
        contextMenuContent.style.display = 'none';
        contextMenuContent.style.visibility = 'hidden'; // Extra hiding
        contextMenuActions.style.display = 'none';
        contextMenuActions.style.visibility = 'hidden'; // Extra hiding
        
        // Add searching class for potential animations
        searchResultsContainer.classList.add('searching');
        
        // For Arc searches, show special layout with thumbnails
        if (isArcSearch) {
            addArcSearchResults(matchingResults, searchResultsContainer, query);
        } else {
            // Add regular results with staggered animation
            matchingResults.forEach((result, index) => {
                window.contextSearchTimeout = setTimeout(() => {
                    addSearchResultItem(result, searchResultsContainer);
                    // Remove searching class after last item
                    if (index === matchingResults.length - 1) {
                        setTimeout(() => {
                            searchResultsContainer.classList.remove('searching');
                        }, 100);
                    }
                }, index * 100); // 100ms delay between each result
            });
        }
    } else {
        // No results found, hide actions
        searchResultsDiv.style.display = 'block';
        contextMenuContent.style.display = 'none';
        contextMenuContent.style.visibility = 'hidden'; // Extra hiding
        contextMenuActions.style.display = 'none';
        contextMenuActions.style.visibility = 'hidden'; // Extra hiding
        searchResultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-text">No results found</div>
                <div class="no-results-subtext">Try a different search term</div>
            </div>
        `;
    }
}

function addSearchResultItem(result, container) {
    const resultItem = document.createElement('div');
    resultItem.className = 'context-menu-item search-result-item';
    resultItem.style.opacity = '0';
    resultItem.style.transform = 'translateY(10px)';
    
    // Add click handler for specific file types
    if (result.name === "Project Pluto: Working Spec" && result.type === "docx") {
        resultItem.onclick = () => {
            openWordWindow();
            // Close the context menu after opening Word
            hideFileExplorerContextMenu();
        };
        resultItem.style.cursor = 'pointer';
    }
    
    const iconHtml = result.icon.endsWith('.svg') ? 
        `<img src="${result.icon}" alt="${result.type}" class="action-icon">` : 
        result.icon;
    
    resultItem.innerHTML = `
        <div class="context-item-icon">
            ${iconHtml}
        </div>
        <div class="context-item-content">
            <div class="context-item-title">${result.name}</div>
            <div class="context-item-subtitle">${result.reason || 'Title contains matching characters'}</div>
            <div class="context-item-time">${result.date} • ${result.time}</div>
        </div>
    `;
    
    container.appendChild(resultItem);
    
    // Animate in
    setTimeout(() => {
        resultItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        resultItem.style.opacity = '1';
        resultItem.style.transform = 'translateY(0)';
    }, 10);
}

function addArcSearchResults(matchingResults, container, query) {
    // Add "Best match" header
    const bestMatchHeader = document.createElement('div');
    bestMatchHeader.className = 'arc-search-header';
    bestMatchHeader.textContent = 'Best match';
    bestMatchHeader.style.opacity = '0';
    container.appendChild(bestMatchHeader);
    
    // Get the two Arc results with thumbnails
    const arcThumbnailResults = matchingResults.filter(result => result.isSpecialArcResult);
    
    if (arcThumbnailResults.length > 0) {
        // Create thumbnails container
        const thumbnailsContainer = document.createElement('div');
        thumbnailsContainer.className = 'arc-thumbnails-container';
        thumbnailsContainer.style.opacity = '0';
        
        arcThumbnailResults.slice(0, 2).forEach((result, index) => {
            const thumbnailItem = document.createElement('div');
            thumbnailItem.className = 'arc-thumbnail-item';
            
            const thumbnailImage = document.createElement('img');
            thumbnailImage.src = result.thumbnail;
            thumbnailImage.alt = result.name;
            thumbnailImage.className = 'arc-thumbnail-image';
            
            const thumbnailTitle = document.createElement('div');
            thumbnailTitle.className = 'arc-thumbnail-title';
            thumbnailTitle.textContent = result.name;
            
            const thumbnailSubtitle = document.createElement('div');
            thumbnailSubtitle.className = 'arc-thumbnail-subtitle';
            thumbnailSubtitle.textContent = result.date;
            
            const thumbnailReason = document.createElement('div');
            thumbnailReason.className = 'arc-thumbnail-reason';
            thumbnailReason.textContent = result.reason || 'Contains matching characters';
            
            thumbnailItem.appendChild(thumbnailImage);
            thumbnailItem.appendChild(thumbnailTitle);
            thumbnailItem.appendChild(thumbnailSubtitle);
            thumbnailItem.appendChild(thumbnailReason);
            
            thumbnailsContainer.appendChild(thumbnailItem);
        });
        
        container.appendChild(thumbnailsContainer);
    }
    
    // Add regular list results for all Arc results
    const regularResults = matchingResults.filter(result => !result.isSpecialArcResult);
    
    regularResults.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'context-menu-item search-result-item arc-list-item';
        resultItem.style.opacity = '0';
        
        const iconHtml = result.icon.endsWith('.svg') ? 
            `<img src="${result.icon}" alt="${result.type}" class="action-icon">` : 
            result.icon;
        
        const timeText = result.time ? `${result.date} • ${result.time}` : result.date;
        
        resultItem.innerHTML = `
            <div class="context-item-icon pptx-icon">
                ${iconHtml}
            </div>
            <div class="context-item-content">
                <div class="context-item-title">${result.name}</div>
                <div class="context-item-time">${timeText}</div>
            </div>
        `;
        
        container.appendChild(resultItem);
    });
    
    // Animate everything in with staggered timing
    setTimeout(() => {
        bestMatchHeader.style.transition = 'opacity 0.3s ease';
        bestMatchHeader.style.opacity = '1';
    }, 50);
    
    setTimeout(() => {
        const thumbnailsContainer = container.querySelector('.arc-thumbnails-container');
        if (thumbnailsContainer) {
            thumbnailsContainer.style.transition = 'opacity 0.3s ease';
            thumbnailsContainer.style.opacity = '1';
        }
    }, 150);
    
    // Animate list items
    const listItems = container.querySelectorAll('.arc-list-item');
    listItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease';
            item.style.opacity = '1';
        }, 250 + (index * 100));
    });
    
    // Remove searching class after animations
    setTimeout(() => {
        container.classList.remove('searching');
    }, 250 + (listItems.length * 100));
}

function resetContextMenuSearchState() {
    const searchInput = document.getElementById('contextSearchInput');
    const searchResultsDiv = document.getElementById('contextSearchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const contextMenuContent = document.getElementById('contextMenuContent');
    const contextMenuActions = document.getElementById('contextMenuActions');
    
    if (!searchInput || !searchResultsDiv || !searchResultsContainer || !contextMenuContent || !contextMenuActions) return;
    
    // Clear search input
    searchInput.value = '';
    
    // Clear any active timeouts
    clearTimeout(window.contextSearchTimeout);
    
    // Clear search results
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.classList.remove('searching');
    
    // Reset visibility states - show recent files and actions, hide search results
    searchResultsDiv.style.display = 'none';
    contextMenuContent.style.display = 'block';
    contextMenuContent.style.visibility = 'visible'; // Restore visibility
    contextMenuActions.style.display = 'block';
    contextMenuActions.style.visibility = 'visible'; // Restore visibility
    
    // Remove any transition states
    searchResultsDiv.style.transition = '';
    contextMenuContent.style.transition = '';
    contextMenuActions.style.transition = '';
}

// Word Comment Scroll Detection
function initializeWordCommentScrollDetection() {
    const wordContent = document.querySelector('.word-content');
    
    if (!wordContent) return;
    
    function checkCommentVisibility() {
        const commentedSection = document.querySelector('.commented-section[data-comment-id="sarah-1"]');
        const commentThread = document.querySelector('.comment-thread[data-comment-id="sarah-1"]');
        
        if (!commentedSection || !commentThread) return;
        
        const sectionRect = commentedSection.getBoundingClientRect();
        const contentRect = wordContent.getBoundingClientRect();
        
        // Check if the commented section is visible within the scrollable area
        const isVisible = sectionRect.top < contentRect.bottom && 
                         sectionRect.bottom > contentRect.top;
        
        if (isVisible) {
            commentThread.classList.add('visible');
        } else {
            commentThread.classList.remove('visible');
        }
    }
    
    // Add scroll listener to the word content area
    wordContent.addEventListener('scroll', checkCommentVisibility);
    
    // Initial check
    setTimeout(checkCommentVisibility, 100);
}

// Teams Chat Functionality
function initializeTeamsChat() {
    const messageInput = document.getElementById('teamsMessageInput');
    const sendBtn = document.getElementById('teamsSendBtn');
    const messagesContainer = document.getElementById('teamsMessages');
    
    if (!messageInput || !sendBtn || !messagesContainer) return;
    
    // Initialize with existing messages
    loadInitialMessages();
    
    // Send message function
    function sendMessage() {
        const messageText = messageInput.value.trim();
        const fileCardsContainer = document.querySelector('.teams-file-cards-container');
        
        // Check if we have either text or file cards
        if (!messageText && !fileCardsContainer) return;
        
        // Collect file cards HTML if they exist
        let fileCardsHTML = '';
        if (fileCardsContainer) {
            const fileCards = fileCardsContainer.querySelectorAll('.teams-file-card');
            fileCardsHTML = Array.from(fileCards).map(card => {
                const fileName = card.querySelector('.file-card-name').textContent;
                const fileType = card.querySelector('.file-card-type').textContent;
                return `<div class="message-file-card"><div class="message-file-icon">📁</div><div class="message-file-content"><div class="message-file-name">${fileName}</div><div class="message-file-type">${fileType}</div></div></div>`;
            }).join('');
        }
        
        // Combine text and file cards inside a single message bubble
        let messageContent = '';
        if (fileCardsHTML || messageText) {
            messageContent = '<div class="message-text">';
            if (fileCardsHTML) {
                messageContent += `<div class="message-files">${fileCardsHTML}</div>`;
            }
            if (messageText) {
                messageContent += messageText;
            }
            messageContent += '</div>';
        }
        
        // Add user message
        addMessageWithFiles('sent', messageContent, getCurrentTime());
        
        // Clear input and file cards
        messageInput.value = '';
        if (fileCardsContainer) {
            fileCardsContainer.remove();
        }
        updateSendButton();
        
        // Show typing indicator
        showTypingIndicator();
        
        // Generate and show Sarah's response after a delay
        setTimeout(() => {
            hideTypingIndicator();
            // Prepare message context for response generation
            let responseContext = messageText || '';
            let hasPlutoAssets = false;
            if (fileCardsContainer) {
                const fileCards = fileCardsContainer.querySelectorAll('.teams-file-card');
                const fileNames = Array.from(fileCards).map(card => 
                    card.querySelector('.file-card-name').textContent
                );
                // Check if Pluto design assets was shared
                hasPlutoAssets = fileNames.some(name => name.toLowerCase().includes('pluto design assets'));
                responseContext = (responseContext ? responseContext + ' ' : '') + fileNames.join(' ');
            }
            
            // Generate response based on context
            let response;
            if (hasPlutoAssets) {
                response = "Thanks! Now I can stop bothering you 😄";
            } else {
                response = generateCopilotResponse(responseContext);
            }
            
            if (response) {
                addMessage('received', response, getCurrentTime(), 'Sarah Miller', 'SM');
            }
        }, 1500 + Math.random() * 1000); // Random typing delay
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', updateSendButton);
    
    // Auto-resize textarea
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    });
    
    function updateSendButton() {
        const hasText = messageInput.value.trim().length > 0;
        const hasFileCards = document.querySelector('.teams-file-cards-container') !== null;
        const hasContent = hasText || hasFileCards;
        sendBtn.disabled = !hasContent;
    }
    
    // Initial button state
    updateSendButton();
}

function loadInitialMessages() {
    const messagesContainer = document.getElementById('teamsMessages');
    
    const initialMessages = `
        <div class="message-day-separator">
            <span>Today</span>
        </div>
        
        <div class="message received">
            <div class="message-avatar">SM</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Sarah Miller</span>
                    <span class="message-time">10:30 AM</span>
                </div>
                <div class="message-text">Hi! I wanted to follow up on the quarterly review presentation. Do you have time to go over the slides today?</div>
            </div>
        </div>
        
        <div class="message sent">
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">10:32 AM</span>
                </div>
                <div class="message-text">Sure! I'm free after 2 PM. Should we meet in person or over Teams?</div>
            </div>
        </div>
        
        <div class="message received">
            <div class="message-avatar">SM</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Sarah Miller</span>
                    <span class="message-time">10:35 AM</span>
                </div>
                <div class="message-text">Teams works great! I'll send a meeting invite for 2:30 PM. Let me know when you're ready for the call and I'll share my screen to show the current draft.</div>
            </div>
        </div>
        
        <div class="message received">
            <div class="message-avatar">SM</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">Sarah Miller</span>
                    <span class="message-time">10:37 AM</span>
                </div>
                <div class="message-text">Also, I've updated the Pluto product spec after your shareout on the North Star design. I think we can make it into P1 changes - I'm hopeful the presentation goes well and we can continue forward quickly.<br><br>Could you take a quick look at it and let me know if you have any questions?</div>
            </div>
        </div>
    `;
    
    messagesContainer.innerHTML = initialMessages;
    scrollToBottom();
}

function updateSidebarChatPreview(type, text, time, senderName = null) {
    // Find Sarah Miller's chat item in the sidebar
    const chatItems = document.querySelectorAll('.chat-item');
    let sarahChatItem = null;
    
    chatItems.forEach(item => {
        const chatName = item.querySelector('.chat-name');
        if (chatName && chatName.textContent.trim() === 'Sarah Miller') {
            sarahChatItem = item;
        }
    });
    
    if (sarahChatItem) {
        const chatPreview = sarahChatItem.querySelector('.chat-preview');
        const chatTime = sarahChatItem.querySelector('.chat-time');
        
        if (chatPreview && chatTime) {
            // Extract text content from HTML (in case there are file cards)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = text;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            
            // Update preview text based on message type
            if (type === 'sent') {
                chatPreview.textContent = textContent || 'You sent a file';
            } else {
                // For received messages, don't include sender name since it's already implied
                chatPreview.textContent = textContent;
            }
            
            // Update time to "now" or "1m" for recent messages
            chatTime.textContent = '1m';
        }
    }
}

function addMessage(type, text, time, senderName = null, avatar = null) {
    const messagesContainer = document.getElementById('teamsMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let messageHTML = '';
    
    if (type === 'received') {
        messageHTML = `
            <div class="message-avatar">${avatar || 'SM'}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${senderName || 'Sarah Miller'}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
    } else {
        messageHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-text">${text}</div>
            </div>
        `;
    }
    
    messageDiv.innerHTML = messageHTML;
    messagesContainer.appendChild(messageDiv);
    
    // Animate message appearance
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    scrollToBottom();
    
    // Update sidebar chat preview
    updateSidebarChatPreview(type, text, time, senderName);
}

function addMessageWithFiles(type, content, time, senderName = null, avatar = null) {
    const messagesContainer = document.getElementById('teamsMessages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let messageHTML = '';
    
    if (type === 'received') {
        messageHTML = `
            <div class="message-avatar">${avatar || 'SM'}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="sender-name">${senderName || 'Sarah Miller'}</span>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body">${content}</div>
            </div>
        `;
    } else {
        messageHTML = `
            <div class="message-content">
                <div class="message-header">
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-body">${content}</div>
            </div>
        `;
    }
    
    messageDiv.innerHTML = messageHTML;
    messagesContainer.appendChild(messageDiv);
    
    // Animate message appearance
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    scrollToBottom();
    
    // Update sidebar chat preview
    updateSidebarChatPreview(type, content, time, senderName);
}

function showTypingIndicator() {
    const messagesContainer = document.getElementById('teamsMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="typing-avatar">SM</div>
        <div class="typing-text">Sarah is typing...</div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addReactionToLastMessage(reaction) {
    const messagesContainer = document.getElementById('teamsMessages');
    const sentMessages = messagesContainer.querySelectorAll('.message.sent');
    const lastSentMessage = sentMessages[sentMessages.length - 1];
    
    if (lastSentMessage) {
        // Check if reaction already exists
        let reactionDiv = lastSentMessage.querySelector('.message-reaction');
        if (!reactionDiv) {
            reactionDiv = document.createElement('div');
            reactionDiv.className = 'message-reaction';
            lastSentMessage.querySelector('.message-content').appendChild(reactionDiv);
        }
        
        reactionDiv.innerHTML = `
            <div class="reaction-item">
                <span class="reaction-emoji">${reaction}</span>
                <span class="reaction-count">1</span>
                <span class="reaction-user">Sarah Miller</span>
            </div>
        `;
        
        // Animate reaction appearance
        reactionDiv.style.opacity = '0';
        reactionDiv.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            reactionDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            reactionDiv.style.opacity = '1';
            reactionDiv.style.transform = 'scale(1)';
        }, 500); // Small delay to make it feel natural
        
        scrollToBottom();
    }
}

function generateCopilotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Predefined responses based on keywords
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return "Hi there! How are you doing today? 😊";
    }
    
    if (message.includes('pluto') || message.includes('project')) {
        return "I'm excited about the Project Pluto updates! I think the changes we discussed will really move the needle. Have you had a chance to review the spec I shared?";
    }
    
    // Specific response for Pluto design assets folder
    if (message.includes('pluto design assets') || (message.includes('pluto') && message.includes('design') && message.includes('assets'))) {
        return "Thanks! Now I can stop bothering you 😄";
    }
    
    if (message.includes('design assets') || message.includes('pm mocks') || message.includes('baseline assets') || (message.includes('assets') && message.includes('pm'))) {
        return "Thank you so much! These are exactly what I needed for the PM mocks. This will really help me create compelling visuals for the LT presentation. I really appreciate you sending these over! 🙏";
    }
    
    if (message.includes('yup one sec') || message.includes('yup 1 sec') || (message.includes('yup') && message.includes('sec'))) {
        // Add thumbs up reaction to the message
        setTimeout(() => {
            addReactionToLastMessage('👍');
        }, 1000);
        return null; // Don't send a text response, just react
    }
    
    if (message.includes('meeting') || message.includes('call')) {
        return "Perfect! I'll send the calendar invite shortly. Looking forward to walking through the presentation together.";
    }
    
    if (message.includes('thanks') || message.includes('thank you')) {
        return "You're very welcome! Always happy to help. Let me know if you need anything else.";
    }
    
    if (message.includes('question') || message.includes('help')) {
        return "Of course! I'm here to help. What questions do you have? We can discuss them during our call if that's easier.";
    }
    
    if (message.includes('review') || message.includes('feedback')) {
        return "I'd love your feedback! The quarterly review is really important, and I want to make sure we cover all the key points effectively.";
    }
    
    if (message.includes('time') || message.includes('when')) {
        return "I'm flexible with timing! Any time after 2 PM works for me. Just let me know what works best for your schedule.";
    }
    
    if (message.includes('good') || message.includes('great') || message.includes('awesome')) {
        return "That's wonderful to hear! I'm really optimistic about how everything is coming together.";
    }
    
    if (message.includes('yes') || message.includes('sure') || message.includes('ok') || message.includes('okay')) {
        return "Excellent! I'll get everything set up on my end. This is going to be a productive session.";
    }
    
    if (message.includes('no') || message.includes('not')) {
        return "No worries at all! Let me know if there's anything I can do to help or if you'd prefer to reschedule.";
    }
    
    // Default responses for general conversation
    const defaultResponses = [
        "That's a great point! I hadn't thought about it from that angle.",
        "Absolutely! I completely agree with your perspective on this.",
        "That makes sense. How do you think we should proceed?",
        "I appreciate you bringing that up. It's definitely worth considering.",
        "Good question! Let me think about that for a moment.",
        "You're right about that. We should definitely factor that into our planning.",
        "I see what you mean. That could be a game changer for the project.",
        "Interesting perspective! I'd love to explore that idea further.",
        "That's exactly what I was thinking too. Great minds think alike!",
        "Thanks for sharing that insight. It really helps clarify things."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    });
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('teamsMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// Drag and Drop Functionality
let dragPreview = null;
let isFileDragging = false;

function handleDragStart(event) {
    isFileDragging = true;
    const fileName = event.target.dataset.fileName;
    const fileType = event.target.dataset.fileType;
    
    // Set drag data
    event.dataTransfer.setData('text/plain', fileName);
    event.dataTransfer.setData('application/x-file-type', fileType);
    
    // Create drag preview with a slight delay to ensure proper positioning
    requestAnimationFrame(() => {
        createDragPreview(fileName, fileType, event);
    });
    
    // Hide default drag image
    const dragImage = document.createElement('div');
    dragImage.style.opacity = '0';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up drag image after a short delay
    setTimeout(() => {
        if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
        }
    }, 100);
}

function handleDragEnd(event) {
    console.log('Drag end triggered');
    isFileDragging = false;
    
    // Force remove drag preview with a slight delay to ensure all events are processed
    setTimeout(() => {
        removeDragPreview();
        removeDropZoneHighlight();
    }, 50);
}

function createDragPreview(fileName, fileType, event) {
    // Remove any existing drag preview first
    removeDragPreview();
    
    dragPreview = document.createElement('div');
    dragPreview.className = 'drag-preview';
    dragPreview.innerHTML = `
        <div class="drag-preview-content">
            <div class="drag-preview-icon">📁</div>
            <div class="drag-preview-text">${fileName}</div>
            <div class="drag-preview-add-btn">
                <div class="add-btn-circle">+</div>
            </div>
        </div>
    `;
    
    dragPreview.style.cssText = `
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        max-width: 250px;
        transform: translate(-50%, -50%);
    `;
    
    dragPreview.querySelector('.drag-preview-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    dragPreview.querySelector('.drag-preview-icon').style.cssText = `
        font-size: 16px;
    `;
    
    dragPreview.querySelector('.drag-preview-text').style.cssText = `
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #333;
    `;
    
    dragPreview.querySelector('.add-btn-circle').style.cssText = `
        width: 20px;
        height: 20px;
        background: #107c10;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
    `;
    
    document.body.appendChild(dragPreview);
    
    // Update position based on mouse position
    updateDragPreviewPosition(event);
}

function updateDragPreviewPosition(event) {
    if (dragPreview && isFileDragging) {
        // Only update if we have valid coordinates
        if (event.clientX > 0 && event.clientY > 0) {
            const x = event.clientX + 15;
            const y = event.clientY - 15;
            
            // Ensure preview stays within viewport bounds
            const maxX = window.innerWidth - dragPreview.offsetWidth - 10;
            const maxY = window.innerHeight - dragPreview.offsetHeight - 10;
            
            dragPreview.style.left = Math.min(x, maxX) + 'px';
            dragPreview.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
        }
    }
}

function removeDragPreview() {
    console.log('Removing drag preview', dragPreview);
    if (dragPreview) {
        try {
            if (document.body.contains(dragPreview)) {
                document.body.removeChild(dragPreview);
                console.log('Drag preview removed successfully');
            }
        } catch (error) {
            console.log('Error removing drag preview:', error);
        }
        dragPreview = null;
    }
}

// Add mouse move listener to update drag preview position during drag
document.addEventListener('dragover', (event) => {
    if (isFileDragging && dragPreview) {
        event.preventDefault();
        updateDragPreviewPosition(event);
    }
});

// Also add mousemove as backup for when dragover doesn't fire
document.addEventListener('mousemove', (event) => {
    if (isFileDragging && dragPreview) {
        updateDragPreviewPosition(event);
    }
});

// Add global drag event listeners to ensure preview follows cursor
document.addEventListener('drag', (event) => {
    if (isFileDragging && dragPreview && event.clientX > 0 && event.clientY > 0) {
        updateDragPreviewPosition(event);
    }
});

// Add global cleanup listeners
document.addEventListener('dragend', (event) => {
    console.log('Global dragend triggered');
    if (isFileDragging) {
        isFileDragging = false;
        setTimeout(() => {
            removeDragPreview();
            removeDropZoneHighlight();
        }, 100);
    }
});

document.addEventListener('drop', (event) => {
    console.log('Global drop triggered');
    if (isFileDragging) {
        isFileDragging = false;
        setTimeout(() => {
            removeDragPreview();
            removeDropZoneHighlight();
        }, 50);
    }
});

// Cleanup on mouse up as final fallback
document.addEventListener('mouseup', (event) => {
    if (isFileDragging && dragPreview) {
        console.log('Mouse up cleanup triggered');
        setTimeout(() => {
            isFileDragging = false;
            removeDragPreview();
            removeDropZoneHighlight();
        }, 200);
    }
});

// Teams Drop Zone Functionality
function setupTeamsDropZone() {
    const teamsWindow = document.getElementById('teamsWindow');
    const teamsArea = document.querySelector('.teams-chat-area');
    
    if (teamsWindow && teamsArea) {
        // Add listeners to the main teams window
        teamsWindow.addEventListener('dragover', handleTeamsDragOver);
        teamsWindow.addEventListener('drop', handleTeamsDrop);
        teamsWindow.addEventListener('dragenter', handleTeamsDragEnter);
        teamsWindow.addEventListener('dragleave', handleTeamsDragLeave);
        
        // Also add listeners to the chat area specifically
        teamsArea.addEventListener('dragover', handleTeamsDragOver);
        teamsArea.addEventListener('drop', handleTeamsDrop);
        teamsArea.addEventListener('dragenter', handleTeamsDragEnter);
        teamsArea.addEventListener('dragleave', handleTeamsDragLeave);
        
        // Add mousemove listener to teams window to ensure drag preview follows cursor
        teamsWindow.addEventListener('mousemove', (event) => {
            if (isFileDragging && dragPreview) {
                updateDragPreviewPosition(event);
            }
        });
    }
}

function handleTeamsDragOver(event) {
    if (isFileDragging) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';
        
        // Update drag preview position
        if (dragPreview) {
            updateDragPreviewPosition(event);
        }
        
        addDropZoneHighlight();
    }
}

function handleTeamsDragEnter(event) {
    if (isFileDragging) {
        event.preventDefault();
        event.stopPropagation();
        addDropZoneHighlight();
    }
}

function handleTeamsDragLeave(event) {
    if (isFileDragging) {
        const teamsWindow = document.getElementById('teamsWindow');
        // Only remove highlight if we're really leaving the teams window
        if (teamsWindow && !teamsWindow.contains(event.relatedTarget)) {
            removeDropZoneHighlight();
        }
    }
}

function addDropZoneHighlight() {
    const sarahChat = document.querySelector('.chat-item.active');
    const teamsArea = document.querySelector('.teams-chat-area');
    
    if (sarahChat && !sarahChat.classList.contains('drop-highlight')) {
        sarahChat.classList.add('drop-highlight');
        sarahChat.style.backgroundColor = 'rgba(0, 120, 212, 0.1)';
        sarahChat.style.borderLeft = '3px solid #0078d4';
        sarahChat.style.transition = 'all 0.2s ease';
    }
    
    if (teamsArea && !teamsArea.classList.contains('drop-zone-active')) {
        teamsArea.classList.add('drop-zone-active');
        teamsArea.style.backgroundColor = 'rgba(0, 120, 212, 0.02)';
        teamsArea.style.transition = 'all 0.2s ease';
    }
}

function removeDropZoneHighlight() {
    const sarahChat = document.querySelector('.chat-item.active');
    const teamsArea = document.querySelector('.teams-chat-area');
    
    if (sarahChat && sarahChat.classList.contains('drop-highlight')) {
        sarahChat.classList.remove('drop-highlight');
        sarahChat.style.backgroundColor = '';
        sarahChat.style.borderLeft = '';
        sarahChat.style.transition = '';
    }
    
    if (teamsArea && teamsArea.classList.contains('drop-zone-active')) {
        teamsArea.classList.remove('drop-zone-active');
        teamsArea.style.backgroundColor = '';
        teamsArea.style.transition = '';
    }
}

function handleTeamsDrop(event) {
    if (isFileDragging) {
        event.preventDefault();
        event.stopPropagation();
        
        console.log('Drop triggered in Teams');
        
        // Immediately clean up drag state
        isFileDragging = false;
        removeDragPreview();
        removeDropZoneHighlight();
        
        const fileName = event.dataTransfer.getData('text/plain');
        const fileType = event.dataTransfer.getData('application/x-file-type');
        
        if (fileName && fileType) {
            insertFileCardIntoChat(fileName, fileType);
        }
    }
}

function insertFileCardIntoChat(fileName, fileType) {
    const messageInput = document.getElementById('teamsMessageInput');
    if (!messageInput) return;
    
    // Create a container div that will hold both the card and any text
    const inputContainer = messageInput.parentElement;
    
    // Check if there's already a file cards container
    let fileCardsContainer = inputContainer.querySelector('.teams-file-cards-container');
    if (!fileCardsContainer) {
        fileCardsContainer = document.createElement('div');
        fileCardsContainer.className = 'teams-file-cards-container';
        fileCardsContainer.style.cssText = `
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        `;
        inputContainer.insertBefore(fileCardsContainer, messageInput);
    }
    
    // Create the file card element
    const fileCard = document.createElement('div');
    fileCard.className = 'teams-file-card';
    fileCard.style.cssText = `
        display: flex;
        align-items: center;
        background: #f3f2f1;
        border: 1px solid #e1dfdd;
        border-radius: 4px;
        padding: 8px 12px;
        gap: 12px;
        font-size: 14px;
        max-width: 300px;
        position: relative;
        cursor: pointer;
        transition: background-color 0.2s ease;
    `;
    
    // Add hover effect
    fileCard.addEventListener('mouseenter', () => {
        fileCard.style.backgroundColor = '#f0f0f0';
    });
    fileCard.addEventListener('mouseleave', () => {
        fileCard.style.backgroundColor = '#f3f2f1';
    });
    
    fileCard.innerHTML = `
        <div class="file-card-icon" style="font-size: 16px; display: flex; align-items: center;">📁</div>
        <div class="file-card-content" style="flex: 1; min-width: 0;">
            <div class="file-card-name" style="font-weight: 600; color: #323130; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fileName}</div>
            <div class="file-card-type" style="font-size: 12px; color: #605e5c;">Folder</div>
        </div>
        <div class="file-card-remove" style="
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            background: #d13438; 
            color: white; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 10px; 
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease;
        ">×</div>
    `;
    
    // Show remove button on hover
    fileCard.addEventListener('mouseenter', () => {
        const removeBtn = fileCard.querySelector('.file-card-remove');
        removeBtn.style.opacity = '1';
    });
    fileCard.addEventListener('mouseleave', () => {
        const removeBtn = fileCard.querySelector('.file-card-remove');
        removeBtn.style.opacity = '0';
    });
    
    // Add remove functionality
    const removeBtn = fileCard.querySelector('.file-card-remove');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileCard.remove();
        
        // Remove container if no more cards
        if (fileCardsContainer.children.length === 0) {
            fileCardsContainer.remove();
        }
        
        // Update send button state
        const sendBtn = document.getElementById('teamsSendBtn');
        const messageInput = document.getElementById('teamsMessageInput');
        if (sendBtn && messageInput) {
            const hasText = messageInput.value.trim().length > 0;
            const hasFileCards = document.querySelector('.teams-file-cards-container') !== null;
            sendBtn.disabled = !(hasText || hasFileCards);
        }
    });
    
    // Add the card to the container
    fileCardsContainer.appendChild(fileCard);
    
    // Focus back to the input
    messageInput.focus();
    
    // Auto-resize the textarea
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
    
    // Update send button state (enable it since we now have a file card)
    const sendBtn = document.getElementById('teamsSendBtn');
    if (sendBtn) {
        sendBtn.disabled = false;
    }
    
    // Add a subtle animation
    fileCard.style.opacity = '0';
    fileCard.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
        fileCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        fileCard.style.opacity = '1';
        fileCard.style.transform = 'translateY(0)';
    });
}

// Initialize drag and drop when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Word comment functionality
    setTimeout(initializeWordCommentScrollDetection, 500);
    
    // Initialize Teams chat functionality
    setTimeout(initializeTeamsChat, 500);
    
    // Initialize Teams drop zone
    setTimeout(setupTeamsDropZone, 500);
    
    // Initialize Start Menu functionality
    initializeStartMenu();
    
    // Initialize Phone Pane Views
    initializePhonePaneViews();
    
    // Initialize Settings Flyout
    initializeSettingsFlyout();
    
    // Initialize taskbar clock
    updateTaskbarClock();
    setInterval(updateTaskbarClock, 1000);
});

// Taskbar Clock Function
function updateTaskbarClock() {
    const timeElement = document.getElementById('taskbarTime');
    const dateElement = document.getElementById('taskbarDate');
    
    if (timeElement && dateElement) {
        const now = new Date();
        
        // Format time as h:mm AM/PM
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        timeElement.textContent = `${hours}:${minutes} ${ampm}`;
        
        // Format date as M/D/YYYY
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const year = now.getFullYear();
        dateElement.textContent = `${month}/${day}/${year}`;
    }
}

// Start Menu Functions
function initializeStartMenu() {
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('startMenu');
    const phonePane = document.getElementById('phonePane');
    
    if (startButton && startMenu) {
        // Wait for desktop fade-in to complete before opening start menu
        window.addEventListener('desktopReady', () => {
            openStartMenu();
        }, { once: true });
        
        // Toggle start menu on start button click
        startButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleStartMenu();
        });
        
        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            if (startMenu.classList.contains('active') && 
                !startMenu.contains(e.target) && 
                !startButton.contains(e.target) &&
                !(phonePane && phonePane.contains(e.target))) {
                closeStartMenu();
            }
        });
        
        // Close start menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && startMenu.classList.contains('active')) {
                closeStartMenu();
            }
        });
    }
}

function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.start-button');
    
    if (startMenu.classList.contains('active')) {
        closeStartMenu();
    } else {
        openStartMenu();
    }
}

function openStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.start-button');
    const phonePane = document.getElementById('phonePane');
    
    startMenu.classList.add('active');
    startButton.classList.add('active');
    if (phonePane) phonePane.classList.add('active');
}

function closeStartMenu() {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.start-button');
    const phonePane = document.getElementById('phonePane');
    
    startMenu.classList.remove('active');
    startButton.classList.remove('active');
    if (phonePane) phonePane.classList.remove('active');
}

// Phone Pane View Switching
function initializePhonePaneViews() {
    const androidBtn = document.getElementById('btnAndroid');
    const iphoneBtn = document.getElementById('btnIPhone');
    const hideBtn = document.querySelector('.phone-setup-hide');
    
    if (androidBtn) {
        androidBtn.addEventListener('click', () => {
            showPhoneConnectedView();
        });
    }
    
    if (iphoneBtn) {
        iphoneBtn.addEventListener('click', () => {
            // For now, also show connected view for iPhone
            showPhoneConnectedView();
        });
    }
    
    if (hideBtn) {
        hideBtn.addEventListener('click', () => {
            closeStartMenu();
        });
    }
}

function showPhoneSetupView() {
    const setupView = document.getElementById('phoneSetupView');
    const connectedView = document.getElementById('phoneConnectedView');
    
    if (setupView) setupView.style.display = 'flex';
    if (connectedView) connectedView.style.display = 'none';
}

function showPhoneConnectedView() {
    const setupView = document.getElementById('phoneSetupView');
    const connectedView = document.getElementById('phoneConnectedView');
    
    if (setupView) setupView.style.display = 'none';
    if (connectedView) connectedView.style.display = 'flex';
}

// Get the first page file from the OOBE flow
function getFirstPageFile() {
    // Try to use OOBEFlow if available
    if (window.OOBEFlow && window.OOBEFlow.getOrder) {
        const order = window.OOBEFlow.getOrder();
        if (order && order.length > 0) {
            const firstPageId = order[0];
            const page = window.OOBEFlow.getPage(firstPageId);
            if (page && page.file) {
                return page.file;
            }
        }
    }
    
    // Fallback: read from localStorage
    try {
        const orderRaw = localStorage.getItem('oobeFlowOrder_v2');
        if (orderRaw) {
            const order = JSON.parse(orderRaw);
            if (order && order.length > 0) {
                // Map common page IDs to files
                const pageMap = {
                    'language': 'language.html',
                    'region': 'region.html',
                    'keyboard': 'keyboard.html',
                    'wifi': 'wifi.html',
                    'zdp': 'zdp.html',
                    'eula': 'eula.html',
                    'device-name': 'device_name.html'
                };
                return pageMap[order[0]] || 'language.html';
            }
        }
    } catch (e) {
        console.warn('Error reading flow order:', e);
    }
    
    // Default to language page
    return 'language.html';
}

// Settings Flyout Functions
function toggleSettingsFlyout(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const flyout = document.getElementById('settingsFlyout');
    const settingsIcon = document.querySelector('.app-icon.settings');
    
    if (flyout.classList.contains('active')) {
        closeSettingsFlyout();
    } else {
        openSettingsFlyout();
    }
}

function openSettingsFlyout() {
    const flyout = document.getElementById('settingsFlyout');
    const settingsIcon = document.querySelector('.app-icon.settings');
    
    // Close other flyouts
    closeStartMenu();
    
    // Position flyout centered over the settings icon
    if (settingsIcon) {
        const iconRect = settingsIcon.getBoundingClientRect();
        const flyoutWidth = 280; // matches CSS width
        const iconCenterX = iconRect.left + (iconRect.width / 2);
        const flyoutLeft = iconCenterX - (flyoutWidth / 2);
        
        // Ensure flyout stays within viewport
        const maxLeft = window.innerWidth - flyoutWidth - 12;
        const minLeft = 12;
        flyout.style.left = Math.max(minLeft, Math.min(flyoutLeft, maxLeft)) + 'px';
        flyout.style.transform = 'translateY(0)';
    }
    
    flyout.classList.add('active');
    settingsIcon.classList.add('active');
    
    // Update UI to reflect current settings
    updateSettingsFlyoutUI();
}

function closeSettingsFlyout() {
    const flyout = document.getElementById('settingsFlyout');
    const settingsIcon = document.querySelector('.app-icon.settings');
    
    flyout.classList.remove('active');
    settingsIcon.classList.remove('active');
}

function updateSettingsFlyoutUI() {
    // Update mode buttons
    const currentMode = localStorage.getItem('themeMode') || 'light';
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === currentMode);
    });
    
    // Update color swatches
    const currentTheme = localStorage.getItem('themePalette') || 'standard';
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.theme === currentTheme);
    });
}

function initializeSettingsFlyout() {
    const flyout = document.getElementById('settingsFlyout');
    
    if (!flyout) return;
    
    // Mode button click handlers
    const modeBtns = document.querySelectorAll('.mode-btn');
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            localStorage.setItem('themeMode', mode);
            document.documentElement.classList.toggle('dark', mode === 'dark');
            
            // Update wallpaper for new mode
            if (window.themeManager) {
                window.themeManager.setWallpaper(window.themeManager.currentTheme, false);
            }
            
            updateSettingsFlyoutUI();
        });
    });
    
    // Color swatch click handlers
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const theme = swatch.dataset.theme;
            localStorage.setItem('themePalette', theme);
            
            // Use theme manager to switch theme
            if (window.themeManager) {
                window.themeManager.setTheme(theme);
            }
            
            updateSettingsFlyoutUI();
        });
    });
    
    // Restart flow button handler
    const restartFlowBtn = document.getElementById('restartFlowBtn');
    if (restartFlowBtn) {
        restartFlowBtn.addEventListener('click', () => {
            // Navigate parent window to first page in flow
            if (window.parent && window.parent !== window) {
                // We're in an iframe, navigate the parent
                const firstPageFile = getFirstPageFile();
                if (firstPageFile) {
                    window.parent.location.href = 'pages/' + firstPageFile;
                }
            } else {
                // Direct navigation
                const firstPageFile = getFirstPageFile();
                if (firstPageFile) {
                    window.location.href = '../pages/' + firstPageFile;
                }
            }
            closeSettingsFlyout();
        });
    }
    
    // Close flyout when clicking outside
    document.addEventListener('click', (e) => {
        const settingsIcon = document.querySelector('.app-icon.settings');
        if (flyout.classList.contains('active') && 
            !flyout.contains(e.target) && 
            !settingsIcon.contains(e.target)) {
            closeSettingsFlyout();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && flyout.classList.contains('active')) {
            closeSettingsFlyout();
        }
    });
}
