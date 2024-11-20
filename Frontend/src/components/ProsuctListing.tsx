// ProductListing.tsx
import React from "react";
import { useAppSelector } from "../redux/slices/userSlicer";
import { Link } from "react-router-dom";
import NoData from "../pages/NoData";



const ProductListing: React.FC = () => {
  const products = useAppSelector((state) => state.products);
 
  return (
     <div className="container mx-auto p-4 ">
     { products && products.length ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {   products.map((product) => {
            const discountPercentage = Math.round(
                ((product.price - product.offerPrice) / product.price) * 100
            );

            return (
            <Link to={`/detailedView/${product._id}`}>
                <div
                    key={product._id}
                    className="border rounded-lg shadow-md overflow-hidden bg-white transition-transform transform hover:scale-105"
                >
                    {/* Focus on Image */}
                    <div className="relative">
                        <img
                            src={product.images[0]}
                            alt={product.productName}
                            className="w-full h-[260px] object-cover"
                        />
                    </div>

                    {/* Product Name and Pricing */}
                    <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {product.productName}
                        </h2>
                        <div className="flex  items-center mt-2 gap-2">
                            <span className="text-lg font-bold text-red-500">
                                ${product.offerPrice.toFixed(2)}
                            </span>
                            <span className="line-through text-gray-400 text-sm">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {discountPercentage}% OFF
                            </span>
                        </div>
                    </div>
                </div>
              </Link>
            );
        })}
    </div>
    : <NoData  redirectPath="products/mens"/>}
</div> 

  );
};

export default ProductListing;
