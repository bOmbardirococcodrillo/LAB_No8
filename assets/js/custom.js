/**
 * Lab 5: Custom JavaScript for Contact Form
 * Handles form processing, validation, and result display
 */

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Setup phone number masking
    const phoneInput = document.getElementById('formPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', formatPhoneNumber);
      phoneInput.addEventListener('keydown', handlePhoneKeydown);
    }
    
    // Real-time validation on all fields
    const formInputs = contactForm.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, input[type="range"]');
    formInputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', validateField);
    });
    
    // Initialize submit button state
    updateSubmitButtonState();
  }
});

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Collect form data
  const formData = {
    name: document.getElementById('formName').value.trim(),
    surname: document.getElementById('formSurname').value.trim(),
    email: document.getElementById('formEmail').value.trim(),
    phone: document.getElementById('formPhone').value.trim(),
    address: document.getElementById('formAddress').value.trim(),
    rating1: parseInt(document.getElementById('formRating1').value),
    rating2: parseInt(document.getElementById('formRating2').value),
    rating3: parseInt(document.getElementById('formRating3').value)
  };
  
  // Validate form data
  if (!validateFormData(formData)) {
    showErrorAlert('Please fill in all required fields correctly.');
    return;
  }
  
  // Log to console
  console.log('Form Data:', formData);
  
  // Display results below the form
  displayResults(formData);
  
  // Calculate and display average rating
  const averageRating = (formData.rating1 + formData.rating2 + formData.rating3) / 3;
  displayAverageRating(formData.name, formData.surname, averageRating);
  
  // Show success popup
  showSuccessPopup();
  
  // Reset form
  document.getElementById('contactForm').reset();
  
  // Reset rating values display
  document.getElementById('ratingValue1').textContent = '5';
  document.getElementById('ratingValue2').textContent = '5';
  document.getElementById('ratingValue3').textContent = '5';
}

/**
 * Validate all form data
 * @param {Object} data - Form data object
 * @returns {boolean} - True if valid, false otherwise
 */
function validateFormData(data) {
  // Name validation (letters only)
  if (!data.name || !/^[a-zA-Z\s]+$/.test(data.name)) {
    return false;
  }
  
  // Surname validation (letters only)
  if (!data.surname || !/^[a-zA-Z\s]+$/.test(data.surname)) {
    return false;
  }
  
  // Email validation
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return false;
  }
  
  // Phone validation (non-empty and has enough digits)
  const phoneDigits = data.phone.replace(/\D/g, '');
  if (!data.phone || phoneDigits.length < 11) {
    return false;
  }
  
  // Address validation (non-empty and meaningful)
  if (!data.address || data.address.length < 5) {
    return false;
  }
  
  // Rating validation (1-10 range)
  if (data.rating1 < 1 || data.rating1 > 10 || 
      data.rating2 < 1 || data.rating2 > 10 || 
      data.rating3 < 1 || data.rating3 > 10) {
    return false;
  }
  
  return true;
}

/**
 * Display form results below the form
 * @param {Object} data - Form data object
 */
function displayResults(data) {
  let resultsContainer = document.getElementById('formResults');
  
  // Create results container if it doesn't exist
  if (!resultsContainer) {
    const form = document.getElementById('contactForm');
    resultsContainer = document.createElement('div');
    resultsContainer.id = 'formResults';
    resultsContainer.className = 'form-results mt-4 p-4 bg-light rounded';
    form.parentElement.insertAdjacentElement('afterend', resultsContainer);
  }
  
  // Build results HTML
  const resultsHTML = `
    <h4>Form Results:</h4>
    <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
    <p><strong>Surname:</strong> ${escapeHtml(data.surname)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone number:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Address:</strong> ${escapeHtml(data.address)}</p>
    <p><strong>Rating 1:</strong> ${data.rating1}/10</p>
    <p><strong>Rating 2:</strong> ${data.rating2}/10</p>
    <p><strong>Rating 3:</strong> ${data.rating3}/10</p>
  `;
  
  resultsContainer.innerHTML = resultsHTML;
  resultsContainer.style.display = 'block';
  
  // Scroll to results
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Display average rating with color coding
 * @param {string} name - User's name
 * @param {string} surname - User's surname
 * @param {number} average - Average rating (0-10)
 */
function displayAverageRating(name, surname, average) {
  let averageContainer = document.getElementById('averageRating');
  
  // Create average rating container if it doesn't exist
  if (!averageContainer) {
    const resultsContainer = document.getElementById('formResults');
    averageContainer = document.createElement('div');
    averageContainer.id = 'averageRating';
    averageContainer.className = 'average-rating mt-3 p-3 rounded';
    resultsContainer.parentElement.insertAdjacentElement('afterend', averageContainer);
  }
  
  // Determine color based on average
  let color = '#dc3545'; // red (0-4)
  if (average > 4 && average <= 7) {
    color = '#ff8c00'; // orange (4-7)
  } else if (average > 7) {
    color = '#28a745'; // green (7-10)
  }
  
  // Display average with color
  const averageText = `${name} ${surname}: ${average.toFixed(1)}`;
  averageContainer.innerHTML = `<h5 style="color: ${color}; margin: 0;">${averageText}</h5>`;
  averageContainer.style.display = 'block';
}

/**
 * Show success popup notification
 */
function showSuccessPopup() {
  // Remove existing popup if present
  const existingPopup = document.getElementById('successPopup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup element
  const popup = document.createElement('div');
  popup.id = 'successPopup';
  popup.className = 'success-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <i class="bi bi-check-circle"></i>
      <p>Form submitted successfully!</p>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Add animation class
  setTimeout(() => {
    popup.classList.add('show');
  }, 10);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, 4000);
}

/**
 * Show error alert
 * @param {string} message - Error message
 */
function showErrorAlert(message) {
  alert(message);
}

/**
 * Validate individual field
 * @param {Event} e - Input event
 */
function validateField(e) {
  const field = e.target;
  const fieldId = field.id;
  
  let isValid = true;
  let errorMessage = '';
  
  if (fieldId === 'formName' || fieldId === 'formSurname') {
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Letters only';
    } else if (!/^[a-zA-Z\s]+$/.test(field.value)) {
      isValid = false;
      errorMessage = 'Only letters allowed';
    }
  } else if (fieldId === 'formEmail') {
    if (!field.value.trim()) {
      isValid = false;
      errorMessage = 'Invalid email format';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      isValid = false;
      errorMessage = 'Invalid email format';
    }
  } else if (fieldId === 'formPhone') {
    // For phone, just check if it has enough digits (at least 11 after removing non-digits)
    const digitsOnly = field.value.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      isValid = false;
      errorMessage = 'Phone must have at least 11 digits (+370 format)';
    }
  } else if (fieldId === 'formAddress') {
    if (!field.value.trim() || field.value.trim().length < 5) {
      isValid = false;
      errorMessage = 'Address must be at least 5 characters';
    }
  }
  
  // Apply visual feedback (real-time validation)
  updateFieldValidation(field, isValid, errorMessage);
  
  // Update submit button state after a short delay to ensure DOM is updated
  setTimeout(() => updateSubmitButtonState(), 50);
}

/**
 * Update field validation styling
 * @param {HTMLElement} field - Input field element
 * @param {boolean} isValid - Field validity
 * @param {string} errorMessage - Error message
 */
function updateFieldValidation(field, isValid, errorMessage) {
  // Remove existing error message
  const existingError = field.parentElement.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  if (!isValid) {
    field.classList.add('is-invalid');
    
    // Add error message below field
    const errorDiv = document.createElement('small');
    errorDiv.className = 'field-error text-danger d-block mt-1';
    errorDiv.textContent = errorMessage;
    field.parentElement.appendChild(errorDiv);
  } else {
    field.classList.remove('is-invalid');
  }
}

/**
 * Update submit button state based on form validity
 */
function updateSubmitButtonState() {
  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!submitButton) return;
  
  // Check if all required fields are valid
  const nameInput = document.getElementById('formName');
  const surnameInput = document.getElementById('formSurname');
  const emailInput = document.getElementById('formEmail');
  const phoneInput = document.getElementById('formPhone');
  const addressInput = document.getElementById('formAddress');
  
  // Check all fields are filled and without errors
  const isFormValid = 
    nameInput && nameInput.value.trim() && !nameInput.classList.contains('is-invalid') &&
    surnameInput && surnameInput.value.trim() && !surnameInput.classList.contains('is-invalid') &&
    emailInput && emailInput.value.trim() && !emailInput.classList.contains('is-invalid') &&
    phoneInput && phoneInput.value.trim() && !phoneInput.classList.contains('is-invalid') &&
    addressInput && addressInput.value.trim() && !addressInput.classList.contains('is-invalid');
  
  submitButton.disabled = !isFormValid;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format phone number as user types (Lithuanian format: +370 6xx xxxxx)
 * Allows only digits, automatically formats
 * @param {Event} e - Input event
 */
function formatPhoneNumber(e) {
  const input = e.target;
  let value = input.value.replace(/\D/g, ''); // Remove all non-digits
  
  // Limit to 12 digits (370 + 6 + 8 digits for Lithuanian format)
  if (value.length > 12) {
    value = value.slice(0, 12);
  }
  
  // Format based on length:
  // 370 = +370
  // 3706 = +370 6
  // 37061234 = +370 61 234
  // 370612345678 = +370 61 234 5678
  let formatted = '';
  
  if (value.length === 0) {
    formatted = '';
  } else if (value.length <= 3) {
    formatted = '+' + value;
  } else if (value.length <= 5) {
    formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3);
  } else {
    formatted = '+' + value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5);
  }
  
  input.value = formatted;
  
  // Log for debugging
  console.log('Phone formatted:', formatted);
}

/**
 * Handle special keys for phone input (prevent non-digit characters)
 * @param {Event} e - Keydown event
 */
function handlePhoneKeydown(e) {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
  const isDigit = /^\d$/.test(e.key);
  
  if (!isDigit && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

