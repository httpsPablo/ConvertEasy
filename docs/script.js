// Conversion types configuration
const conversionTypes = {
  documents: [
    { from: 'PDF', to: 'Word', accept: '.pdf', icon: 'file' },
    { from: 'Word', to: 'PDF', accept: '.doc,.docx', icon: 'file-text' },
    { from: 'TXT', to: 'PDF', accept: '.txt', icon: 'file-text' }
  ],
  images: [
    { from: 'Image', to: 'Text', accept: 'image/*', icon: 'image' },
    { from: 'JPG', to: 'PNG', accept: '.jpg,.jpeg', icon: 'image' },
    { from: 'PNG', to: 'GIF', accept: '.png', icon: 'image' }
  ],
  audio: [
    { from: 'MP3', to: 'WAV', accept: '.mp3', icon: 'music' },
    { from: 'WAV', to: 'FLAC', accept: '.wav', icon: 'music' },
    { from: 'FLAC', to: 'MP3', accept: '.flac', icon: 'music' }
  ],
  video: [
    { from: 'MP4', to: 'AVI', accept: '.mp4', icon: 'video' },
    { from: 'AVI', to: 'MKV', accept: '.avi', icon: 'video' },
    { from: 'MKV', to: 'MP4', accept: '.mkv', icon: 'video' }
  ],
  executables: [
    { from: 'EXE', to: 'DMG', accept: '.exe', icon: 'terminal' },
    { from: 'DMG', to: 'DEB', accept: '.dmg', icon: 'terminal' },
    { from: 'DEB', to: 'EXE', accept: '.deb', icon: 'terminal' }
  ]
};

// State management
let currentCategory = 'documents';
let currentConversion = null;
let selectedFile = null;
let isConverting = false;

// DOM Elements
const conversionTypesContainer = document.getElementById('conversionTypes');
const dropzone = document.getElementById('dropzone');
const fileUpload = document.getElementById('fileUpload');
const uploadFormat = document.getElementById('uploadFormat');
const errorMessage = document.getElementById('errorMessage');
const convertBtn = document.getElementById('convertBtn');
const uploadForm = document.getElementById('uploadForm');

// Icon components
const icons = {
  file: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>',
  'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
  image: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  music: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  video: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>',
  terminal: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>'
};

// Initialize conversion types
function renderConversionTypes(category) {
  conversionTypesContainer.innerHTML = '';
  
  conversionTypes[category].forEach((type, index) => {
    const button = document.createElement('button');
    button.className = 'conversion-type';
    button.innerHTML = `
      <div class="conversion-type-icon">
        ${icons[type.icon]}
      </div>
      <span class="conversion-type-text">
        ${type.from} to ${type.to}
      </span>
    `;
    
    button.addEventListener('click', () => selectConversion(type, button));
    if (index === 0) {
      button.classList.add('active');
      currentConversion = type;
      updateUploadFormat();
    }
    
    conversionTypesContainer.appendChild(button);
  });
}

// Category selection
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.category-btn.active')?.classList.remove('active');
    btn.classList.add('active');
    currentCategory = btn.dataset.category;
    renderConversionTypes(currentCategory);
    resetForm();
  });
});

// Conversion type selection
function selectConversion(type, button) {
  document.querySelector('.conversion-type.active')?.classList.remove('active');
  button.classList.add('active');
  currentConversion = type;
  updateUploadFormat();
  resetForm();
}

// Update upload format text
function updateUploadFormat() {
  uploadFormat.textContent = currentConversion ? 
    `Supported format: ${currentConversion.from}` : '';
}

// File handling
fileUpload.addEventListener('change', handleFileSelect);
dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '#16a34a';
});

dropzone.addEventListener('dragleave', () => {
  dropzone.style.borderColor = '#d1d5db';
});

dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.style.borderColor = '#d1d5db';
  const files = e.dataTransfer.files;
  if (files.length) {
    fileUpload.files = files;
    handleFileSelect({ target: fileUpload });
  }
});

function handleFileSelect(e) {
  errorMessage.textContent = '';
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    
    // Validate file type
    const acceptedTypes = currentConversion.accept.split(',');
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      return file.name.toLowerCase().endsWith(type.replace('.', '').toLowerCase());
    });
    
    if (!isValidType) {
      errorMessage.textContent = `Please select a valid ${currentConversion.from} file`;
      convertBtn.disabled = true;
      return;
    }
    
    selectedFile = file;
    document.querySelector('.upload-text').textContent = file.name;
    convertBtn.disabled = false;
  }
}

// Form submission
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!selectedFile || isConverting) return;
  
  isConverting = true;
  convertBtn.disabled = true;
  convertBtn.innerHTML = `
    <span class="spinner"></span>
    Converting...
  `;
  
  try {
    // Simulate conversion
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create and download result
    const result = `Converted ${selectedFile.name} (In production, this would use proper conversion libraries)`;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    resetForm();
  } catch (err) {
    errorMessage.textContent = 'An error occurred during conversion. Please try again.';
  } finally {
    isConverting = false;
    convertBtn.disabled = false;
    convertBtn.textContent = 'Convert File';
  }
});

// Reset form
function resetForm() {
  selectedFile = null;
  fileUpload.value = '';
  document.querySelector('.upload-text').textContent = 'Drop your file here or click to browse';
  errorMessage.textContent = '';
  convertBtn.disabled = true;
  updateUploadFormat();
}

// Initialize
renderConversionTypes(currentCategory);