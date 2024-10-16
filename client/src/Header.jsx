import {Link} from 'react-router-dom'
import {useContext} from 'react';
import {UserContext} from './UserContext.jsx';
import CustomDropdown from './testdropdown.jsx'

export default function Header() {
  const {user} = useContext(UserContext);
  return (
    <div>
      <div>
        <header className="flex xs:justify-center md:justify-between mb-2">
          <Link to="/" className="flex items-center gap-1 xs:hidden md:flex"> 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          <span className="font-bold text-xl xs:hidden md:flex"> AirBnb </span>
          </Link>
          <div className="font-bold xs:text-sm sm:text-md flex items-center border border-gray-300 rounded-full shadow-md shadow-gray-300 xs: w-full md:w-fit">
            <div className='flex flex-row place-content-evenly item-center py-2 px-4 gap-2 grow'>
              <div className='xs:text-sm sm:text-base'>Anywhere</div>
              <div className="border border-l border-gray-300" />
              <div className='xs:text-sm sm:text-base'>Any week</div>
              <div className="border border-l border-gray-300" />
              <div className='xs:text-sm sm:text-base'> Add guests</div>
            </div>
            <div className='flex flex-row p-3 gap-2 mr-0'>
              <button className="bg-primary text-white p-1 rounded-full ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
            </div>
          </div>
          <CustomDropdown>
            {!!user && (
              <div>
                {user.name}
              </div>
            )}
          </CustomDropdown>
        </header>
      </div>
      <hr className="-mx-8"></hr>
    </div>
    
  )
}