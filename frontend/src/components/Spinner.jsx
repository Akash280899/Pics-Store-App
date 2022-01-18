import React from 'react'
import Loader from 'react-loader-spinner'

const Spinner = ({message}) => {
    return (
        <div className='flex flex-col justify-center items-center w-full h-full'>
            <Loader 
                type="TailSpin"
                color='#0078d6'
                height={50}
                width={200}
                className='m-5'
            />
            <p>{message}</p>
        </div>
    )
}

export default Spinner
