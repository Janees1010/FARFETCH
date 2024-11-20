import { useState } from 'react';

type Props = {
    imgArr: string[];
};

const ImageSlider = ({ imgArr }: Props) => {
    const [index, setIndex] = useState<number>(0);

    const previous = () => {
        setIndex((prevIndex) => (prevIndex === 0 ? imgArr.length - 1 : prevIndex - 1));
    };

    const forward = () => {
        setIndex((prevIndex) => (prevIndex === imgArr.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="overflow-hidden relative w-full h-full">
            <div
                className="flex transition-transform duration-500"
                style={{
                    transform: `translateX(-${index * 100}%)`,
                    // width: `${imgArr.length * 100}%`,
                }}
            >
                {imgArr.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt="Product"
                        className="w-full h-72 md:h-[480px] object-cover flex-shrink-0"
                    />
                ))}
            </div>
            <div className="absolute bottom-4 md:bottom-40px] left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button onClick={previous} className=" transition">
                    <div className='bg-black w-[10px] h-[10px] rounded-[50%]'></div>
                </button>
                <button onClick={forward} className=" transition">
                    <div className='bg-black w-[10px] h-[10px] rounded-[50%]'></div>
                </button>
            </div>
        </div>
    );
};

export default ImageSlider;

{/* <button onClick={forward} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
    Next
</button> */}