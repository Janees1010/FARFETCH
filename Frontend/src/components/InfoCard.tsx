import React from 'react'

interface props {
    Icon:React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title:string,
    description:string
}

const InfoCard = ({Icon,title,description}:props) => {
  return (
    <div className="col-span-12 sm:col-span-6 w-full max-w-[350px] md:col-span-4 flex  gap-[6px] px-2 py-5 flex-col border-2 border-gray-200 rounded-lg ">
       <Icon className="text-md" />
       <p className="text-sm font-medium text-gray-500">{title}</p>
       <p className="text-xs font-medium text-gray-500">{description}</p>
     </div>
  )
}

export default InfoCard

