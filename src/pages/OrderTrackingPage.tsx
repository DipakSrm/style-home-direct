import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { IOrder } from "@/lib/types";
import { OrderStatus } from "@/lib/types";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

const OrderTracking = () => {
  const {orderId } = useParams();
  const [orderData, setOrderData] = useState<IOrder | null>(null);
const [loading, setLoading] = useState(false);
  // Mock tracking data
  const { token } = useAuth().state;
  const orderSteps: OrderStatus[] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];
  useEffect(() => {
    if (!token || !orderId) return;

    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setOrderData(response.data.data);
        }
        // Replace with actual API call to fetch orders
        // const response = await axios.get('/api/orders');
        // setOrders(response.data.orders);
        console.log("Fetching order history...");
      } catch (error) {
        setLoading(false);
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, []);

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);
  

  const getStatusIcon = (status: OrderStatus, completed: boolean) => {
    if (!completed) return <Clock className="h-4 w-4 text-gray-400" />;

    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-indigo-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {orderData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{orderData._id}</CardTitle>
                <Badge
                  className={
                    orderData.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : orderData.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                 {getStatusText(orderData.status)}
                </Badge>
              </div>
              {orderData.status !== "delivered" && orderData.deliveredAt ? (
                <p className="text-sm text-gray-600">
                  Estimated delivery:{" "}
                  {new Date(orderData.placedAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  3-5 business days delivery
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderSteps.map((step, index) => {
                  const currentIndex = orderSteps.indexOf(orderData.status);
                  const completed = index < currentIndex;
                  const active = index === currentIndex;

                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(step, completed || active)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p
                            className={`font-medium ${
                              completed || active
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {capitalize(step)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {orderData.status === "cancelled" && (
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon("cancelled", true)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-red-600">Cancelled</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!orderData  && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order not found
              </h3>
              <p className="text-gray-600">
                Please check your order number and try again.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
