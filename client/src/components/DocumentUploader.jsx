import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import API from '../services/api';

export default function DocumentUploader({ onUploadSuccess, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF, TXT, or Markdown document to upload.');
      return;
    }

    setUploading(true);
    setError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);

    try {
      // Omit explicit Content-Type header so Axios generates boundary automatically
      const res = await API.post('/documents/upload', formData);

      setSuccessMsg(`"${file.name}" uploaded and parsed successfully!`);
      setTimeout(() => {
        if (onUploadSuccess) onUploadSuccess(res.data.document);
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      const serverMsg = err.response?.data?.error || err.message || 'Failed to upload document.';
      setError(serverMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900/95 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            Upload Research Document
          </h3>
          <p className="text-xs text-slate-400">Upload PDF, TXT, or Markdown papers to extract knowledge graphs & claims.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            file
              ? 'border-cyan-500/80 bg-cyan-500/10'
              : 'border-slate-700 hover:border-cyan-500/50 bg-slate-950/50'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload-input"
          />
          <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>

            {file ? (
              <div>
                <p className="text-sm font-bold text-cyan-300">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag & Drop PDF / TXT here, or <span className="text-cyan-400 underline">Browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PDFs, TXT, MD research articles up to 20MB</p>
              </div>
            )}
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Parsing PDF & Extracting Entities...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Synthesize Knowledge
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
