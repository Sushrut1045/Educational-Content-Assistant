import React from 'react';
import { ArrowRight, Upload, Book, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Home = () => {
    const [isRestarting, setIsRestarting] = useState(false);

    const handleRestart = async () => {
        setIsRestarting(true);
        try {
            // Tell backend to clear ChromaDB
            await axios.post('http://localhost:8000/reset');

            // Clear local storage items
            localStorage.removeItem('eduassist_files');
            localStorage.removeItem('eduassist_chat');

            alert("Session successfully restarted! All documents and chat history have been cleared.");
        } catch (error) {
            console.error("Failed to restart session", error);
            alert("Failed to restart session. Make sure the backend is running.");
        } finally {
            setIsRestarting(false);
        }
    };
    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                    Master Your Studies with <span className="text-primary">AI</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Upload your textbooks, get instant answers, and optimized summaries.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/library" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={handleRestart}
                        disabled={isRestarting}
                        className="bg-white text-red-600 border border-red-200 px-8 py-3 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50"
                    >
                        {isRestarting ? "Restarting..." : "Restart Session"}
                    </button>
                    <button className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                        Learn More
                    </button>
                </div>
            </header>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
                {/* Feature 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-primary mb-4">
                        <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Smart Ingestion</h3>
                    <p className="text-gray-600">Upload any PDF textbook or course material. Our AI parses and indexes it instantly for retrieval.</p>
                </div>
                {/* Feature 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                        <Book className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">ScaleDown Summaries</h3>
                    <p className="text-gray-600">Get high-yield summaries that extract key concepts and definitions, removing the fluff.</p>
                </div>
                {/* Feature 3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                        <ArrowRight className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Continuous Conversing</h3>
                    <p className="text-gray-600">Your chat history is saved securely in your browser so you never lose your spot.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
