import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'
import ReelFeed from '../../components/ReelFeed'

const Saved = () => {
    const [ videos, setVideos ] = useState([])

    useEffect(() => {
        axios.get("/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner?._id || item.food.foodPartner,
                    foodPartnerName: item.food.foodPartner?.name,
                    isSaved: true
                }))
                setVideos(savedFoods)
            })
    }, [])

    const removeSaved = async (item) => {
        try {
            const response = await axios.post("/api/food/save", { foodId: item._id }, { withCredentials: true })
            if (response.data.message?.includes('unsaved')) {
                setVideos((prev) => prev.filter((v) => v._id !== item._id))
            }
        } catch (error) {
            console.error('Remove saved failed:', error.response?.data || error.message)
            alert('Unable to remove saved item. Please try again.')
        }
    }

    return (
        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />
    )
}

export default Saved