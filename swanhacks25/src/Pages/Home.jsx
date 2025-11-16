import Navbar from "../Components/Navbar"

function Home() {
  return(
    <>
    <Navbar/>
      <div className="px-[4%] py-[50px] text-white text-left">

        <div>
          <h1 className='text-[2rem] sm:text-[3rem] md:text-[3rem] lg:text-[3.5rem] font-bold'>Emergency <br/>Dispatch Dashboard</h1>
          <p className="text-gray-200 font-thin text-[1.3rem] mt-[20px]">AI-powered incident identification from incoming text messages</p>
          <div className='mt-[40px]'>
            <a className='bg-[#E03F3B] px-[25px] py-[12px] rounded-md' href='/dashboard'>Enter Dashboard</a>
          </div>
        </div>

        <div className="flex mt-[80px] gap-5">
          <div className='bg-[#182236] p-[30px]'>
            <h1 className='text-2xl font-bold mb-[20px]'>AI Message Parsing</h1>
            <p className='text-lg font-thin'>
              Automatically collects important keywords
            </p>
          </div>

          <div className='bg-[#182236] p-[30px]'>
            <h1 className='text-2xl font-bold mb-[20px]'>Centralized Incident Feed</h1>
            <p className='text-lg font-thin'>
              Displays all incoming emergencies with sorting capabilities
            </p>
          </div>
          
          <div className='bg-[#182236] p-[30px]'>
            <h1 className='text-2xl font-bold mb-[20px]'>Fast Dispatcher Workflow</h1>
            <p className='text-lg font-thin'>
              Intuitive tools designed for response teams operating under pressure
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home