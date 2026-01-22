import React from 'react'
import Posts from './Posts'

const Feed = () => {
  return (
    <div className='flex-1 my-6 flex flex-col items-center w-full px-2 md:px-0 md:pl-[20%]'>
        <Posts/>
    </div>
  )
}

export default Feed