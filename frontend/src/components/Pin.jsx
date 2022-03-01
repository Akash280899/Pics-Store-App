import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { client, urlFor } from '../client'
import { MdDownloadForOffline } from 'react-icons/md'
import { fetchUser } from '../utils/fetchUser'
import { v4 as uuidv4 } from 'uuid'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { AiTwotoneDelete } from 'react-icons/ai'

const Pin = ({pin : {postedBy, image, _id, destination, save}}) => {

    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate();
    const user = fetchUser();

    const saved = !!(save?.filter((item) => item?.postedBy?._id === user?.googleId))?.length

    const savePin = (id) => {
        if(!saved) {
            client.patch(id)
                .setIfMissing({ save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user?.googleId,
                    postedBy: {
                        _type : 'postedBy',
                        _ref: user?.googleId,
                    },
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                })
        }
    }

    const deletePin = (id) => {
        client.delete(id).then(() => window.location.reload())
    }

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img src={(urlFor(image).width(250).url())} alt="pin-image" className='rounded-lg w-full'/>
                {hovered && (
                    <div className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'>
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    className='bg-cyan-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Download
                                </a>
                            </div>
                            {saved ? (
                                <button
                                    type='button'
                                    className='bg-cyan-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    {save?.length} Saved
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        savePin(_id)
                                    }}
                                    type='button'
                                    className='bg-cyan-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none'
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className='flex justify-end items-center gap-2 w-full'>
                            {postedBy?._id === user?.googleId && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link 
                to={`/user-profile/${postedBy?._id}`}
                className='flex gap-2 mt-2 items-center'
            >
                <img
                    src={postedBy?.image}
                    alt="profile"
                    className='w-8 h-8 rounded-full object-cover'
                />
                <p>{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin
