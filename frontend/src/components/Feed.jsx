import React , { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import {client} from '../client'
import { feedQuery, searchQuery } from '../utils/data'

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState()
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true)
        if(categoryId) {
            const query = searchQuery(categoryId);
            client.fetch(query).then((data) => {
                setPins(data)
                setLoading(false)
            });
        } else {
            client.fetch(feedQuery).then((data) => {
                setPins(data)
                setLoading(false)
            })
        } 
    },[categoryId])

    if(loading) return <Spinner message="We are looking into new ideas!!" />

    if(!pins?.length) return <h2>No Images Available</h2>

    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed
