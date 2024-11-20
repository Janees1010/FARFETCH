import { useEffect, useState } from 'react';
import DataTable, { TableStyles } from 'react-data-table-component';
import axios from "axios";
import { Order } from './OrdersPage';

const AdminOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    // const [status,setStatus] =   useState<string>()

    const fetchOrders = async () => {
        try {
            const res = await axios.get("http://localhost:9000/orders");
            setOrders(res.data.orders);
        } catch (err:any) {
            console.log(err.message);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            // Optimistically update the local state
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
            
            // Make the request to update the status on the server
            await axios.post(`http://localhost:9000/order/status-change`, { status: newStatus, orderId });

            // Re-fetch orders after updating the status to sync with the server
            await fetchOrders();
        } catch (error: any) {
            console.log("Error updating order status:", error.message);
        }
    };
    
  console.log("orders", orders);
  
    const columns = [
        {
            name: "Name",
            selector: (row: Order) => row.productName,
            sortable: true,
            cell: (row: Order) => <span className="font-semibold">{row.productName}</span>,
        },
        {
            name: "Buyer",
            selector: (row: Order) => row.deliveryDetails.name,
            cell: (row: Order) => <span>{row.deliveryDetails.name}</span>,
        },
        {
            name: "Size",
            selector: (row: Order) => row.size,
            sortable: true,
            cell: (row: Order) => <span className="font-semibold">{row.size}</span>,
        },
        {
            name: "Color",
            selector: (row: Order) => row.color,
            sortable: true,
            cell: (row: Order) => <span className="font-semibold">{row.color}</span>,
        },
        {
            name: "Phone",
            selector: (row: Order) => row.deliveryDetails.phoneNumber,
            sortable: true,
            cell: (row: Order) => <span className="font-semibold">{row.deliveryDetails.phoneNumber}</span>,
        },
        {
            name: "Price",
            selector: (row: Order) => row.offerPrice,
            sortable: true,
            cell: (row: Order) => <span className="text-green-500">${row.offerPrice}</span>,
        },
        {
            name: "Category",
            selector: (row: Order) => row.category,
            sortable: true,
        },
        {
            name: "Address",
            selector: (row: Order) => row.deliveryDetails.address,
            cell: (row: Order) => <p>{row.deliveryDetails.address}</p>,
        },
        // {
        //     name: "Image",
        //     cell: (row: Order) => (
        //         row.images && row.images.length > 0 ? (
        //             <img
        //                 width="50px"
        //                 height="50px"
        //                 src={row.images[0]}
        //                 alt={row.productName}
        //             />
        //         ) : (
        //             <span>No Image</span>
        //         )
        //     ),
        //     sortable: true,
        // },
        {
            name: "Status",
            selector: (row: Order) => row.status,
            cell: (row: Order) => (
                   
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.orderId, e.target.value)}
                    className="border rounded px-2 py-1"
                >
                    <option value="Shipped">Shipped</option>
                    <option value="outForDelivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                </select>
            ),
        },
    ];

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
                padding: '2px',
            },
        },
    };

    return (
        <div className='p-2 rounded-md'>
            {orders.length > 0 ? (
                <DataTable columns={columns} data={orders} customStyles={customTableStyles} pagination />
            ) : (
                <p>No orders available</p>
            )}
        </div>
    );
}

export default AdminOrders;
