import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        api.get("/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                const items = response.data.foodItems.map((item) => ({
                    ...item,
                    _id: item._id?.toString(),
                    foodPartner: item.foodPartner?._id?.toString() || item.foodPartner,
                    foodPartnerName: item.foodPartner?.name,
                    likeCount: item.likeCount ?? 0,
                    savesCount: item.savesCount ?? 0,
                    isLiked: false,
                    isSaved: false
                }))

                // Shuffle items so each login/session shows a random order
                const shuffle = (arr, seed = null) => {
                    const a = arr.slice();
                    for (let i = a.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [a[i], a[j]] = [a[j], a[i]];
                    }
                    return a;
                }

                const shuffled = shuffle(items)
                // Debug: log first 6 ids to help QA verify ordering quickly
                try {
                    console.debug('shuffled-video-ids', shuffled.slice(0, 6).map(v => v._id))
                } catch (e) { /* ignore in prod */ }

                setVideos(shuffled)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {
        try {
            const response = await api.post("/api/food/like", { foodId: item._id }, { withCredentials: true })
            const isNowLiked = Boolean(response.data.like)

            setVideos((prev) => prev.map((v) => {
                if (v._id?.toString() !== item._id?.toString()) return v
                const count = v.likeCount ?? 0
                return {
                    ...v,
                    isLiked: isNowLiked,
                    likeCount: isNowLiked ? count + 1 : Math.max(0, count - 1)
                }
            }))
        } catch (error) {
            console.error('Like failed:', error.response?.data || error.message)
            alert('Unable to update like. Please try again.')
        }
    }

    async function saveVideo(item) {
        try {
            const response = await api.post("/api/food/save", { foodId: item._id }, { withCredentials: true })
            const message = (response.data.message || '').toLowerCase()
            const isNowSaved = message.includes('saved successfully') && !message.includes('unsaved')

            setVideos((prev) => prev.map((v) => {
                if (v._id?.toString() !== item._id?.toString()) return v
                const count = v.savesCount ?? 0
                return {
                    ...v,
                    isSaved: isNowSaved,
                    savesCount: isNowSaved ? count + 1 : Math.max(0, count - 1)
                }
            }))
        } catch (error) {
            console.error('Save failed:', error.response?.data || error.message)
            alert('Unable to save right now. Please try again.')
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home