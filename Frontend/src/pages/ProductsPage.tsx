import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../redux/store';
import {setProducts } from "../redux/slices/productSlicer";
import { useAppDispatch } from "../redux/slices/userSlicer";
import ProductListing from '../components/ProsuctListing';
import ClipLoader from 'react-spinners/ClipLoader';


const ProductsListedPage = () => {
  const { category } = useParams();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading,setLoading] = useState(true)
  // const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLength,setTotalLength] = useState(0)
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const productsPerPage = 8; // Number of products per page

 
  const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
  };
 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    // Set a new timeout for debouncing
    const newTimeout = setTimeout(() => {
      if (value) {
        axios.get(`http://localhost:4000/search/${value}`).then((res) => {
          if (res.data) {
            dispatch(setProducts(res.data));
            setLoading(false)
          }
        });
      } else {
        fetchProducts();
      }
    },800); 

    setDebounceTimeout(newTimeout);
  };
  const handleSort = (e:React.ChangeEvent<HTMLSelectElement>)=>{
       const {value} = e.target;
       console.log(value,"sort");
       if(value){
          axios.get(`http://localhost:4000/sort/${value}`).then((res)=>{
              setLoading(false)
              dispatch(setProducts(res.data))
          }).catch((err)=>{
              console.log(err.message);
          })
       }
       
  }
  
  const  totalPages = Math.ceil(totalLength / productsPerPage)
  const fetchProducts = ()=>{
    axios
    .get(`http://localhost:4000/fetch-products/${currentPage}/${category}`)
    .then((res) => {
      if (res.data) {
        setLoading(false)
        setTotalLength(res.data.TotalLength)
        const fetchedProducts = res.data.products;
        // fetchedProducts.forEach((prod: productType) => {
          dispatch(setProducts(fetchedProducts));
        // });
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
  }
  useEffect(() => {
    fetchProducts()

  }, [category,currentPage]);



   if(loading){
    return <div className="spinner-container flex justify-center items-center h-screen">
               <ClipLoader color="#3498db" size={50} /> {/* Customize spinner */}
          </div>
   }

  return (
    <div className=" min-h-screen p-6">
      {/* Search Bar and Filter */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6 bg-gray-100 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full focus:none md:w-2/6 p-2 mb-3 py-4 outline-none md:mb-0 border-none border-gray-300 rounded-lg "
          value={searchTerm}
          onChange={(e) => handleSearch(e)}
        />
        <select
          className="p-2 border bg-white border-gray-300 rounded-lg "
          // value={sortOrder}
          onChange={(e) => handleSort(e)}
        >
          <option value="">Sort by</option>
          <option value="latest">Latest</option>
          <option value="lowprice">Low Price</option>
          <option value="highprice">High Price</option>
          {/* <option value="featured">Featured</option> */}
        </select>
      </div>

      {/* Product Listing */}
      <div className="bg-gray-100   p-4 rounded-lg shadow-sm">
        <ProductListing  />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        { Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 rounded-lg border ${
              currentPage === index + 1
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductsListedPage;
