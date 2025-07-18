import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IOrder } from "@/lib/types";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Orders = () => {
  // Mock order data

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const {token}=useAuth().state;
useEffect(()=>{
if(!token) return

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URI}/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200){
        setOrders(response.data.data);
      }
      // Replace with actual API call to fetch orders
      // const response = await axios.get('/api/orders');
      // setOrders(response.data.orders);
      console.log("Fetching order history...");
    } catch (error) {
      setLoading(false);
      console.error("Error fetching order history:", error);
    }
    finally{
setLoading(false);
    }
  }
  fetchOrderHistory();
},[])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipping";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending";
      default:
        return "Unknown";
    }
  };

  if(loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          <p className="text-gray-600">Please wait while we fetch your orders.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                When you place your first order, it will appear here.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order._id}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Placed on{" "}
                        {new Date(order.placedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2"
                        >
                          <div>
                            <p className="font-medium">{item.productId.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            Rs {item.productId.price}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-amber-600">
                          Rs {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {order.paymentMethod === 'Khalti' && order.paymentStatus === "pending" && (
                        <div className="mt-4 text-red-600">
                          <p className="text-sm">
                            Payment Status: {order.paymentStatus}
                          </p>
                          <p className="text-xs">
                            Please complete your payment to finalize the order.
                          </p>
                        </div>
                      )}
                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <Button variant="outline" size="sm" onClick={()=> navigate(`/orderdetails/${order._id}`)}>
                        View Details
                      </Button>
                      {order.status === "delivered" && (
                        <Button variant="outline" size="sm">
                          Reorder
                        </Button>
                      )}
                      {order.status === "shipped" && (
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
