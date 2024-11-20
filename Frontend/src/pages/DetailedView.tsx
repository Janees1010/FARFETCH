import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {productType}  from '../redux/slices/productSlicer';
import ImageSlider from '../components/ImageSlider';
import { useAppSelector } from '../redux/slices/userSlicer';
import {Toaster,toast} from "react-hot-toast"
import ClipLoader from 'react-spinners/ClipLoader';
import NoData from './NoData';


const DetailedView = () => {
    const {id} = useParams();
    const user =useAppSelector((state) => state.userDetails);
    const navigate = useNavigate()
    const [product, setProduct] = useState<productType>();
    const [size, setSize] = useState<string | undefined>();
    const [color, setColor] = useState<string | undefined>();
    const [quantity,setQuantity]  = useState<number>(1)
    const [loading,setLoading]  = useState(true)
    
    const handleSize = (size: string) => {
        setSize(size);
    };

    const handleColor = (color: string) => {
        setColor(color);
    };
    

    const addToCart = () => {
        if(user.username){
            if(!color || !size  ){
               toast.error("select size and color")
            }else{
                const data = {
                    userId:user._id,
                    size,
                    color,
                    productId:id,
                    quantity
                }
                 console.log(data);
                 axios.post("http://localhost:5000/add",{...data}).then((res)=>{
                       if(res.data){
                          console.log(res.data);
                          toast.success("product added To cart")
                       }
                 }).catch((err)=>{
                      console.log(err.message);    
               })  
            } 
        }else{
              navigate("/signin")
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:4000/product/${id}`).then((res) => {
            if(res.data){        
                setProduct(res.data);
                setLoading(false)
            }else{
                setLoading(false)
            }
        }).catch((err) => {
            setLoading(false)
            console.log(err);
        });
    }, [id]);

    if(loading){
        return <div className="spinner-container flex justify-center items-center h-screen">
                   <ClipLoader color="#3498db" size={50} /> {/* Customize spinner */}
              </div>
       }

      console.log(product,"yyyyyy");
      
    
      return (
         <>
          {  product?.productName  ?
       
         <div className="max-w-[100%] m-2  sm:mx-20 bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
           <Toaster 
                 position="top-center"
                 reverseOrder={false}
             />
            <div className="flex-shrink-0 w-[90%] md:w-[35%] flex items-center md:h-[80%]">
                {
                 product && product.images && product.images.length > 0 ? 
                  <ImageSlider imgArr={product?.images} /> : ""
                }
               
            </div>

            <div className="flex flex-col  justify-between md:justify-end w-full">
                <h2 className="text-2xl font-bold text-gray-700">{product?.productName}</h2>
                <p className="text-gray-600 mt-2">{product?.description}</p>

                <div className="mt-2">
                    {/* <div className="text-2xl font-semibold text-gray-800">${product?.price.toFixed(2)}</div> */}
                    {product?.offerPrice && (
                        <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg text-gray-500 line-through">${product?.price.toFixed(2)}</span>
                            <span className="text-xl font-bold text-red-600">${product?.offerPrice.toFixed(2)}</span>
                            <span className="text-sm text-green-600">
                                ({Math.round((1 - product?.offerPrice / product?.price) * 100)}% off)
                            </span>
                        </div>
                    )}
                </div>

                {/* Color Selection */}
                {product && product.color && product.color.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">Choose Color:</h3>
                        <div className="flex space-x-2 mt-2">
                            {product.color.map((col, index) => (
                                <button
                                    key={index}
                                    style={{ backgroundColor: col }}
                                    className={`w-8 h-8 rounded-full border-2 
                                        ${color === col ? 'border-gray-500 ring-2 ring-gray-500' : 'border-gray-300'}
                                        focus:outline-none transition duration-200`}
                                    onClick={() => handleColor(col)}
                                >
                                    <span className="sr-only">{col}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selection */}
                {product && product.size && product.size.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-700">Choose Size:</h3>
                        <div className="flex space-x-4 mt-2">
                            {product.size.map((siz, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSize(siz)}
                                    className={`px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 ${size === siz ? 'focus:bg-gray-200' : ""}`}
                                >
                                    {siz}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                 <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-700">Select Quantity:</h3>
                    <select
                        value={quantity}
                        onChange={((e)=> setQuantity(parseInt(e.target.value)))}
                        className="mt-2 p-2 border border-gray-300 rounded-lg"
                    >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Buttons Section */}
                <div className="mt-6 flex space-x-4">
                    <button
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                        onClick={addToCart}
                    >
                        Add to Cart
                    </button>
                    <button
                        className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
                    >
                        Buy Now
                    </button>
                </div>
             </div>
        </div>
    : <NoData /> }
        </> 
    );
};

export default DetailedView;
