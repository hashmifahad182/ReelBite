import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    async function handleLogout() {
        try { await axios.get('/api/auth/user/logout', { withCredentials: true }) } catch (e) {}
        try { await axios.get('/api/auth/food-partner/logout', { withCredentials: true }) } catch (e) {}
        navigate('/user/login')
    }

    /* ---------------- Video Preview URL (Derived State) ---------------- */

    const videoURL = useMemo(() => {
        if (!videoFile) return null;
        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    // Cleanup object URL
    useEffect(() => {
        return () => {
            if (videoURL) {
                URL.revokeObjectURL(videoURL);
            }
        };
    }, [videoURL]);

    useEffect(() => {
        axios.get('/api/auth/me', { withCredentials: true })
            .then(response => setCurrentUser(response.data))
            .catch(() => setCurrentUser(null));
    }, []);

    /* ---------------- File Handlers ---------------- */

    const validateFile = (file) => {
        if (!file.type.startsWith('video/')) {
            return 'Please select a valid video file.';
        }

        const maxSizeMB = 100;
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `File size must be less than ${maxSizeMB}MB`;
        }

        return null;
    };

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setVideoFile(null);
            setFileError('');
            return;
        }

        const error = validateFile(file);
        if (error) {
            setFileError(error);
            return;
        }

        setFileError('');
        setVideoFile(file);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer?.files?.[0];
        if (!file) return;

        const error = validateFile(file);
        if (error) {
            setFileError(error);
            return;
        }

        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const openFileDialog = () => fileInputRef.current?.click();

    /* ---------------- Submit Handler ---------------- */

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) return;

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            formData.append('video', videoFile); // ⚠️ Ensure backend expects "video"

            const response = await axios.post(
                '/api/food',
                formData,
                { withCredentials: true }
            );

            console.log(response.data);

            if (currentUser?.type === 'partner' && currentUser?.id) {
                navigate(`/food-partner/${currentUser.id}`);
            } else {
                navigate('/home');
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            const message = error.response?.data?.message || 'Upload failed. Please try again.';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = !name.trim() || !videoFile || loading;

    /* ---------------- UI ---------------- */

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create Food</h1>
                    <p className="create-food-subtitle">
                        Upload a short video, give it a name, and add a description.
                    </p>
                    <div style={{marginLeft:'auto'}}>
                        <button className="auth-submit" onClick={handleLogout} style={{padding:'6px 10px'}}>Logout</button>
                    </div>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    
                    {/* File Upload Section */}
                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Video</label>

                        <input
                            id="foodVideo"
                            ref={fileInputRef}
                            className="file-input-hidden"
                            type="file"
                            accept="video/*"
                            onChange={onFileChange}
                        />

                        <div
                            className="file-dropzone"
                            role="button"
                            tabIndex={0}
                            onClick={openFileDialog}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        >
                            <div className="file-dropzone-inner">
                                <strong>Tap to upload</strong> or drag and drop
                                <div className="file-hint">
                                    MP4, WebM, MOV • Up to 100MB
                                </div>
                            </div>
                        </div>

                        {fileError && (
                            <p className="error-text">{fileError}</p>
                        )}

                        {videoFile && (
                            <div className="file-chip">
                                <span>{videoFile.name}</span>
                                <span>
                                    {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setVideoFile(null);
                                        setFileError('');
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Video Preview */}
                    {videoURL && (
                        <div className="video-preview">
                            <video
                                src={videoURL}
                                controls
                                playsInline
                                preload="metadata"
                                className="video-preview-el"
                            />
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="field-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Spicy Paneer Wrap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div className="field-group">
                        <label>Description</label>
                        <textarea
                            rows={4}
                            placeholder="Write short description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions">
                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isDisabled}
                        >
                            {loading ? 'Uploading...' : 'Save Food'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;