import React, { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, BookOpen, Loader } from 'lucide-react';
import axios from 'axios';

const Library = () => {
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem('eduassist_files');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('eduassist_files', JSON.stringify(files));
    }, [files]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Real API call
            const response = await axios.post('https://educational-content-assistant-94xd.onrender.com/upload', formData);
            setFiles(prev => [...prev, {
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                date: new Date().toLocaleDateString()
            }]);
            setUploading(false);
        } catch (error) {
            console.error("Upload failed", error);
            setUploading(false);
            const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
            alert(`Upload failed: ${errorMessage}`);
        }
    };

    const handleDelete = (indexToDelete) => {
        setFiles(prev => prev.filter((_, idx) => idx !== indexToDelete));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">My Library</h2>

            {/* Upload Area */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-dashed border-gray-300 text-center mb-8 hover:border-primary transition cursor-pointer relative group">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-200">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mb-4">
                        {uploading ? <Loader className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {uploading ? "Processing Document..." : "Click to Upload Textbook (PDF)"}
                    </h3>
                    <p className="text-gray-500">Supported formats: PDF. Max size: 20MB</p>
                </div>
            </div>

            {/* File List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-500 grid grid-cols-12 gap-4">
                    <div className="col-span-6">Document Name</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {files.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No documents uploaded yet.</div>
                ) : (
                    files.map((file, idx) => (
                        <div key={idx} className="px-6 py-4 border-b border-gray-100 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition">
                            <div className="col-span-6 flex items-center gap-3 text-gray-700 font-medium">
                                <FileText className="w-5 h-5 text-red-500" />
                                {file.name}
                            </div>
                            <div className="col-span-2 text-gray-500">{file.size}</div>
                            <div className="col-span-2 text-gray-500">{file.date}</div>
                            <div className="col-span-2 flex justify-end gap-2">
                                <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg text-sm flex items-center gap-1" title="Study">
                                    <BookOpen className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(idx)}
                                    className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Library;
