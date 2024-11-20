import React from 'react';

interface NoDataProps {
  message?: string;
  redirectPath?: string;
}

const NoData: React.FC<NoDataProps> = ({ 
  message = "No results found.", 
}) => {
   
  return (
    <div className='flex justify-center mt-[150px] h-screen'>
      <div className="flex  w-[40%] items-center justify-center h-[90px] bg-gray-300 rounded-2xl shadow-md p-6">
      
          <p className="text-xl text-gray-700">{message}</p>
      
        </div>
    </div>
  );
};

export default NoData;
