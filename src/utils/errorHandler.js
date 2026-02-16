/**
 * Notification helpers for user-facing status messages
 */

/**
 * Display error notification to user
 * @param {string} message - Error message to display
 * @param {number} duration - How long to show (ms), 0 = permanent
 */
export function showError(message, duration = 5000) {
    const notification = createNotification(message, 'error');
    document.body.appendChild(notification);
    
    if (duration > 0) {
        setTimeout(() => notification.remove(), duration);
    }
}

/**
 * Display success notification to user
 * @param {string} message - Success message
 * @param {number} duration - How long to show (ms)
 */
export function showSuccess(message, duration = 3000) {
    const notification = createNotification(message, 'success');
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), duration);
}

/**
 * Display info notification to user
 * @param {string} message - Info message
 * @param {number} duration - How long to show (ms)
 */
export function showInfo(message, duration = 3000) {
    const notification = createNotification(message, 'info');
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), duration);
}

/**
 * Create notification DOM element
 */
function createNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);
    
    return notification;
}

/**
 * Handle async errors with user notification
 * @param {Promise} promise - Promise to wrap
 * @param {string} errorMessage - Custom error message
 */
export async function handleAsync(promise, errorMessage) {
    try {
        return await promise;
    } catch (error) {
        console.error(errorMessage, error);
        showError(`${errorMessage}: ${error.message}`);
        throw error;
    }
}

/**
 * Validate file exists before loading
 * @param {string} url - File URL
 * @returns {Promise<boolean>}
 */
export async function validateFileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}
