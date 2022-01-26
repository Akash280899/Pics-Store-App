import React, { useState } from 'react'
import { useEffect } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { client, urlFor } from '../client';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import {v4 as uuidv4} from 'uuid';
import MasonryLayout from './MasonryLayout';

const PinDetail = ({ user }) => {

    const [pins, setPins] = useState(null);
    const [pinDetails, setPinDetails] = useState(null);
    const [comment, setComment] = useState('');
    const [addComment, setAddComment] = useState(false);
    const { pinId } = useParams()

    const saveComment = () => {
        if(comment) {
            setAddComment(true)
            client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{ 
                    comment, 
                    _key: uuidv4(), 
                    postedBy: { 
                        _type: 'postedBy', 
                        _ref: user._id 
                    }
                }])
                .commit()
                .then(() => {
                    fetchPinDetails();
                    setComment('');
                    setAddComment(false);
            });
        }
    }

    const fetchPinDetails = () => {
        let query = pinDetailQuery(pinId);
        if(query) {
            client.fetch(query)
                .then((data) => {
                    setPinDetails(data[0]);
                    if(data[0]) {
                        query = pinDetailMorePinQuery(data[0])
                        client.fetch(query)
                            .then((res) => setPins(res))
                    }
                })
            
        }
    }

    useEffect(() => {
        fetchPinDetails()
    },[pinId])

    if(!pinDetails) return <Spinner message='Fetching data...'/>
    console.log(pinDetails);
    return (
        <>
        <div className='flex xl:flex-row flex-col m-auto bg-white' style={{ maxWidth: '1500px', borderRadius: '32px' }}>
            <div className='flex justify-center items-center md:items-start flex-initial'>
                <img 
                    src={pinDetails?.image && urlFor(pinDetails.image).url()}
                    className='rounded-t-3xl rounded-b-lg'
                    alt='pin-image'
                />
            </div>
            <div className='w-full p-5 flex-1 xl:min-w-620'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <a
                            className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100'
                            href={`${pinDetails.image?.asset?.url}?dl=`}
                            download
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MdDownloadForOffline />
                        </a>
                    </div>
                    <a href={pinDetails.destination} target="_blank" rel="noreferrer">
                        {pinDetails.destination}
                    </a>
                </div>
                <div>
                    <h1 className='className="text-4xl font-bold break-words mt-3"'>
                        {pinDetails.title}
                    </h1>
                    <p className='mt-3'> {pinDetails.about}</p>
                </div>
                <Link 
                    to={`/user-profile/${pinDetails.postedBy?._id}`}
                    className='flex gap-2 mt-5 items-center bg-white rounded-lg'
                >
                    <img
                        src={pinDetails.postedBy?.image}
                        alt="profile"
                        className='w-8 h-8 rounded-full object-cover'
                    />
                    <p>{pinDetails.postedBy?.userName}</p>
                </Link>
                <h2 className='mt-5 text-2xl'>Comments</h2>
                <div className='max-h-370 overflow-y-auto'>
                    {pinDetails?.comments?.map((value, index) => (
                        <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={index}>
                            <img 
                                src={value.postedBy?.image}
                                alt='user-pic'
                                className='w-10 h-10 rounded-full cursor-pointer'
                            />
                            <div className="flex flex-col">
                                <p className="font-bold">{value.postedBy?.userName}</p>
                                <p>{value.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-wrap mt-6 gap-3'>
                <Link 
                    to={`/user-profile/${pinDetails.postedBy?._id}`}
                >
                    <img
                        src={pinDetails.postedBy?.image}
                        alt="profile"
                        className='w-10 h-10 rounded-full cursor-pointer" alt="user-profile'
                    />
                </Link>
                <input 
                    type='text'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Add Comments here...'
                    className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                />
                <button
                    type='button'
                    className='bg-cyan-400 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                    onClick={saveComment}
                >
                    {addComment ? 'Adding Comment' : 'Add'}
                </button>
                </div>
            </div>
        </div>
        { pins?.length > 0 ? (
            <>
                <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
                    More Like this...
                </h2>
                <MasonryLayout pins={pins}/>
            </>
        ) : (
            <Spinner message="Loading more..." />
        )}
        </>
    )
}

export default PinDetail
