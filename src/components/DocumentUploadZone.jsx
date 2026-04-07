import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, X, FileText } from 'lucide-react';

const DocumentUploadZone = ({ requiredDocs, files, onFilesChange }) => {
  const [dragOver, setDragOver] = useState(null);

  const handleDrop = useCallback((docId, e) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file) onFilesChange({ ...files, [docId]: file });
  }, [files, onFilesChange]);

  const handleFileSelect = (docId, e) => {
    const file = e.target.files?.[0];
    if (file) onFilesChange({ ...files, [docId]: file });
  };

  const removeFile = (docId) => {
    onFilesChange({ ...files, [docId]: null });
  };

  const uploadedCount = requiredDocs.filter(d => files[d.id]).length;

  return (
    <div className="space-y-4">

      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {uploadedCount} of {requiredDocs.length} documents uploaded
        </p>
        <div className="h-2 w-32 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${(uploadedCount / requiredDocs.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Upload Items */}
      <div className="space-y-3">
        {requiredDocs.map(doc => {
          const file = files[doc.id];
          const isDragOver = dragOver === doc.id;

          return (
            <div
              key={doc.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(doc.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(doc.id, e)}
              className={`rounded-lg border-2 border-dashed p-4 transition-all
                ${file
                  ? 'border-green-300 bg-green-50'
                  : isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
              `}
            >
              <div className="flex items-center gap-3">

                {file ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{doc.label}</p>

                  {file ? (
                    <p className="text-xs text-gray-500 truncate">{file.name}</p>
                  ) : (
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  )}
                </div>

                {file ? (
                  <button
                    onClick={() => removeFile(doc.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <label className="cursor-pointer text-sm text-blue-600 font-medium hover:underline">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileSelect(doc.id, e)}
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentUploadZone;