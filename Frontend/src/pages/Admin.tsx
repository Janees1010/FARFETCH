import { useState, useEffect } from 'react';
import DataTable, { TableStyles } from 'react-data-table-component';
import { Link,useNavigate } from 'react-router-dom';
import {productType}  from '../redux/slices/productSlicer';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import axios from 'axios';

const Admin = () => {
  const [products, setProducts] = useState<productType[]>([]);
  const navigate = useNavigate()
  
  const handleEdit = (id:string | undefined) => {
    console.log("Edit product with ID:", id);
    navigate(`/admin/edit/${id}`)
  };

  const confirmDelete = (id:string | undefined) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
      overlayClassName: "bg-black ", 
    });
  };

  const handleDelete = (id:string | undefined)=>{
       setProducts((prev) => prev.filter((item:productType) => (item._id != id)) )
      axios.get(`http://localhost:4000/deleteproduct/${id}`).then((res)=>{
         console.log(res.data);
         if(res.data){
           navigate("/admin")
         }
         
      }).catch((err)=>{
         console.log(err.message);
         
      })
  }


  const columns = [
    {
      name: "Name",
      selector: (row: productType) => row.productName,
      sortable: true,
      cell: (row: productType) => <span className="font-semibold">{row.productName}</span>,
    },
    {
      name: "Price",
      selector: (row: productType) => row.price,
      sortable: true,
      cell: (row: productType) => <span className="text-green-500">${row.price}</span>,
    },
    {
      name: "Category",
      selector: (row: productType) => row.category,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row: productType) => (
        row.images && row.images.length > 0 ? (
          typeof row.images[0] === 'string' ? (
            <img 
              width="50px" 
              height="50px" 
              src={row.images[0]} 
              alt={row.productName} 
            />
          ) : (
            <img 
              width="50px" 
              height="50px" 
              src={URL.createObjectURL(row.images[0])} 
              alt={row.productName} 
            />
          )
        ) : (
          <span>No Image</span>
        )
      ),
      
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: productType) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => confirmDelete(row._id)}
            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    axios.get("http://localhost:4000")
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  },[]);

  return (
    <>
      <div className="p-5 bg-white rounded-lg shadow-lg max-w-6xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Product Management</h2>
        <div className='flex justify-between pb-5'>
          <input type="text" placeholder='Search' />
          <Link to="/admin/add"
            className="ml-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Product
          </Link>
        </div>
        {
          products && products.length > 0 ? 
          <DataTable
            columns={columns}
            data={products}
            pagination
            highlightOnHover
            customStyles={customTableStyles}
          /> : ""
        }
      </div>
    </>
  );
};

// Define the custom table styles using TableStyles
const customTableStyles: TableStyles = {
  headCells: {
    style: {
      backgroundColor: '#f8fafc',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      fontSize: '14px',
      padding: '12px',
    },
  },
  rows: {
    style: {
      minHeight: '50px',
      '&:hover': {
        backgroundColor: '#f1f5f9',
      },
    },
  },
  cells: {
    style: {
      padding: '12px',
    },
  },
};

export default Admin;
