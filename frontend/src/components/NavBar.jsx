import React from 'react'
import { IoIosAdd, IoMdAdd, IoMdSearch } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'

const NavBar = ({ searchTerm, setSearchTerm, user }) => {
    const navigate = useNavigate();

    if(!user) return null;
    
    return (
        <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7 ">
            <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
                <IoMdSearch 
                    fontSize={21}
                    className='ml-1'
                />
                <input 
                    type="text"
                    placeholder='Search'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => navigate("/search")}
                    className='p-2 w-full bg-white outline-none'
                />
            </div>
            <div className='flex gap-3'>
                <Link to="/create-pin" className='bg-cyan-400 flex items-center w-12 h-12 text-white md:w-14 justify-center rounded-full'>
                    <IoIosAdd fontSize={25}/>
                </Link>
                <Link to={`/user-profile/${user?._id}`} className='hidden md:block'>
                    <img src={user.image} alt='user-logo' className='flex w-14 h-12 rounded-lg'/>
                </Link>
            </div>
        </div>
    )
}

export default NavBar
