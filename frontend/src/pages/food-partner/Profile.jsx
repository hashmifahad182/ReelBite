import React, { useState, useEffect, useRef } from 'react'
import '../../styles/profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ activeVideo, setActiveVideo ] = useState(null)
    const [ fetchError, setFetchError ] = useState('')
    const modalVideoRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        api.get('/api/auth/me', { withCredentials: true })
            .then(response => setCurrentUser(response.data))
            .catch(() => setCurrentUser(null))
    }, [])

    useEffect(() => {
        api.get(`/api/food-partner/${id}`, { withCredentials: true })
            .then(response => {
                const partnerData = response.data?.foodPartner || response.data
                const foodItems = partnerData?.foodItems || response.data?.foodItems || []

                if (!partnerData) {
                    throw new Error('Partner profile response is malformed.')
                }

                setProfile(partnerData)
                setVideos(Array.isArray(foodItems) ? foodItems : [])
                setFetchError('')
            })
            .catch(error => {
                console.error('Could not load partner profile:', error.response?.data || error.message)
                setFetchError(error.response?.data?.message || error.message || 'Unable to load partner profile.')
                setProfile(null)
                setVideos([])
            })
    }, [ id ])

    const isOwnProfile = currentUser?.type === 'partner' && currentUser?.id?.toString() === id?.toString()

    async function handleLogout() {
        try {
            await api.get('/api/auth/food-partner/logout', { withCredentials: true })
        } catch {
            // ignore logout errors
        }
        navigate('/food-partner/login')
    }

    function handleAddFood() {
        navigate('/create-food')
    }

    function openVideo(video) {
        setActiveVideo(video)
    }

    function closeVideo() {
        if (modalVideoRef.current) {
            modalVideoRef.current.pause()
        }
        setActiveVideo(null)
    }

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-meta">
                    <img
                        className="profile-avatar"
                        src={profile?.image || "https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D"}
                        alt={profile?.name || 'Partner avatar'}
                    />
                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name}
                        </h1>
                        <p className="profile-pill profile-address" title="Address">
                            {profile?.address}
                        </p>
                    </div>
                    {isOwnProfile && (
                        <div className="profile-actions">
                            <button className="auth-submit profile-action-btn profile-action-btn--primary" onClick={handleAddFood} type="button">
                                Add food item
                            </button>
                            <button className="auth-submit profile-action-btn profile-action-btn--secondary" onClick={handleLogout} type="button">
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* <p className="profile-description">
                    {profile?.description}
                </p> */}
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {fetchError ? (
                    <div className="profile-error">
                        <p>{fetchError}</p>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="profile-empty">
                        <p>No uploaded videos found for this profile.</p>
                    </div>
                ) : videos.map((v) => (
                    <button key={v._id?.toString() || v.id} type="button" className="profile-grid-item" onClick={() => openVideo(v)}>
                        <video
                            className="profile-grid-video"
                            src={v.video}
                            muted
                            playsInline
                            preload="metadata"
                        />
                        <div className="profile-grid-overlay">
                            <span>Preview</span>
                        </div>
                    </button>
                ))}
            </section>

            {activeVideo && (
                <div className="profile-modal" role="dialog" aria-modal="true">
                    <div className="profile-modal-card">
                        <button type="button" className="profile-modal-close" onClick={closeVideo} aria-label="Close video">
                            ×
                        </button>
                        <video
                            ref={modalVideoRef}
                            className="profile-modal-video"
                            src={activeVideo.video}
                            controls
                            autoPlay
                            controlsList="nodownload"
                        />
                        <p className="profile-modal-title">{activeVideo.name || 'Food video preview'}</p>
                        <p className="profile-modal-description">{activeVideo.description}</p>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Profile