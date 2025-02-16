import React, { useState } from 'react';
import { 
  FileUp, 
  FileDown, 
  FileText, 
  FileImage, 
  File as FilePdf,
  Music,
  Video,
  Terminal
} from 'lucide-react';

type ConversionType = {
  from: string;
  to: string;
  icon: React.ReactNode;
  accept: string;
  category: string;
};

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>('pdf-to-word');
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('documents');

  const conversionTypes: ConversionType[] = [
    // Documents
    { 
      from: 'PDF', 
      to: 'Word', 
      icon: <FilePdf className="w-6 h-6" />,
      accept: '.pdf',
      category: 'documents'
    },
    { 
      from: 'Word', 
      to: 'PDF', 
      icon: <FileText className="w-6 h-6" />,
      accept: '.doc,.docx',
      category: 'documents'
    },
    { 
      from: 'TXT', 
      to: 'PDF', 
      icon: <FileText className="w-6 h-6" />,
      accept: '.txt',
      category: 'documents'
    },
    // Images
    { 
      from: 'Image', 
      to: 'Text', 
      icon: <FileImage className="w-6 h-6" />,
      accept: 'image/*',
      category: 'images'
    },
    { 
      from: 'JPG', 
      to: 'PNG', 
      icon: <FileImage className="w-6 h-6" />,
      accept: '.jpg,.jpeg',
      category: 'images'
    },
    { 
      from: 'PNG', 
      to: 'GIF', 
      icon: <FileImage className="w-6 h-6" />,
      accept: '.png',
      category: 'images'
    },
    // Audio
    { 
      from: 'MP3', 
      to: 'WAV', 
      icon: <Music className="w-6 h-6" />,
      accept: '.mp3',
      category: 'audio'
    },
    { 
      from: 'WAV', 
      to: 'FLAC', 
      icon: <Music className="w-6 h-6" />,
      accept: '.wav',
      category: 'audio'
    },
    { 
      from: 'FLAC', 
      to: 'MP3', 
      icon: <Music className="w-6 h-6" />,
      accept: '.flac',
      category: 'audio'
    },
    // Video
    { 
      from: 'MP4', 
      to: 'AVI', 
      icon: <Video className="w-6 h-6" />,
      accept: '.mp4',
      category: 'video'
    },
    { 
      from: 'AVI', 
      to: 'MKV', 
      icon: <Video className="w-6 h-6" />,
      accept: '.avi',
      category: 'video'
    },
    { 
      from: 'MKV', 
      to: 'MP4', 
      icon: <Video className="w-6 h-6" />,
      accept: '.mkv',
      category: 'video'
    },
    // Executables
    { 
      from: 'EXE', 
      to: 'DMG', 
      icon: <Terminal className="w-6 h-6" />,
      accept: '.exe',
      category: 'executables'
    },
    { 
      from: 'DMG', 
      to: 'DEB', 
      icon: <Terminal className="w-6 h-6" />,
      accept: '.dmg',
      category: 'executables'
    },
    { 
      from: 'DEB', 
      to: 'EXE', 
      icon: <Terminal className="w-6 h-6" />,
      accept: '.deb',
      category: 'executables'
    }
  ];

  const categories = [
    { id: 'documents', name: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { id: 'images', name: 'Images', icon: <FileImage className="w-5 h-5" /> },
    { id: 'audio', name: 'Audio', icon: <Music className="w-5 h-5" /> },
    { id: 'video', name: 'Video', icon: <Video className="w-5 h-5" /> },
    { id: 'executables', name: 'Executables', icon: <Terminal className="w-5 h-5" /> }
  ];

  const getCurrentConversionType = () => {
    return conversionTypes.find(type => 
      `${type.from.toLowerCase()}-to-${type.to.toLowerCase()}` === conversionType
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const currentType = getCurrentConversionType();
      
      // Validate file type
      if (currentType && !file.type.match(new RegExp(currentType.accept.replace('*', '.*')))) {
        setError(`Please select a valid ${currentType.from} file`);
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const convertImageToText = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          // In a real application, you would use Tesseract.js or a backend OCR service
          resolve("Image text extraction would be implemented here with OCR service");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setConverting(true);
    setError(null);

    try {
      let result: string | null = null;
      
      if (conversionType === 'image-to-text') {
        result = await convertImageToText(selectedFile);
      } else {
        // Simulate conversion for other types
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = `Converted ${selectedFile.name} (In production, this would use proper conversion libraries)`;
      }

      // Create and download the result
      const blob = new Blob([result], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-${selectedFile.name}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('An error occurred during conversion. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const filteredConversionTypes = conversionTypes.filter(
    type => type.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight">WebWorkVision</h1>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <FileUp className="w-8 h-8" />
            <h2 className="text-2xl font-bold">File Converter</h2>
          </div>
          <p className="mt-2 opacity-90 text-center">Convert your files easily and securely</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          <div className="flex overflow-x-auto space-x-4 mb-8 pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedFile(null);
                  setError(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Conversion Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredConversionTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => {
                  setConversionType(`${type.from.toLowerCase()}-to-${type.to.toLowerCase()}`);
                  setSelectedFile(null);
                  setError(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  conversionType === `${type.from.toLowerCase()}-to-${type.to.toLowerCase()}`
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  {type.icon}
                  <span className="font-medium">
                    {type.from} to {type.to}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* File Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleConvert}>
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={getCurrentConversionType()?.accept}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileDown className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-lg font-medium text-gray-700">
                      {selectedFile ? selectedFile.name : 'Drop your file here or click to browse'}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {!selectedFile && `Supported format: ${getCurrentConversionType()?.from}`}
                    </span>
                  </label>
                </div>
                {error && (
                  <div className="mt-2 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!selectedFile || converting}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed relative"
              >
                {converting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting...
                  </span>
                ) : (
                  'Convert File'
                )}
              </button>
            </form>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Easy Upload</h3>
              <p className="text-gray-600">Simple drag and drop interface for your files</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileDown className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Fast Conversion</h3>
              <p className="text-gray-600">Quick and efficient file conversion</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-lg mb-2">Multiple Formats</h3>
              <p className="text-gray-600">Support for various file formats</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 WebWorkVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;