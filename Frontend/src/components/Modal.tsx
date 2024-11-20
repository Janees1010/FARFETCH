import React from 'react'

interface props {
    handler:()=>{},
    title:string,
    message:string,
    setShowModal:React.Dispatch<React.SetStateAction<boolean>>
}

const Modal = ({handler,title,message,setShowModal}:props) => {
  return (
    <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-5 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
        <p>Are you sure you want to cancel this order?</p>
        <div className="flex justify-end mt-4">
            <button 
                onClick={() => setShowModal(false)} 
                className="mr-2 px-4 py-2 border border-gray-300 rounded"
            >
                Cancel
            </button>
            <button 
                onClick={handler} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Confirm
            </button>
        </div>
    </div>
</div>
  )
}

export default Modal
