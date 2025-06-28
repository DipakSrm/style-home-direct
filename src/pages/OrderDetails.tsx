import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";
import { IOrder } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
const [order, setOrder] = useState<IOrder | null>(null);
  // Mock detailed order data
  const { token } = useAuth().state;
  const {toast }=useToast();
  const { user } = useAuth().state;
  const navigate=useNavigate()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token && orderId) return;

    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setOrder(response.data.data);
          console.log("Order data fetched successfully:", response.data);
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
    fetchOrderData();
  }, []);

const handleKhaltiPayment = async () => {
   if(!token || !order) {
    toast({
      title: "Error",
      description: "You must be logged in to make a payment.",
      variant: "destructive",
    });
   }
      try {
        const response = await axios.post(
          `http://localhost:5000/api/v1/payment/khalti/initiate`,
          {
            return_url: "http://localhost:8080/orderConfirmation",
            website_url: "http://localhost:8080/",
            amount: parseInt((order.totalAmount * 100).toFixed(2)), // Convert to paisa
            purchase_order_id: order._id,
            purchase_order_name: `${user.name} Order #${order._id}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          window.open(response.data.payment_url);
        }
      } catch (error) {
        console.log("Error while payment cart:", error);
       
      }
    
}


  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Order not found
              </h3>
              <p className="text-gray-600 mb-6">
                The order you're looking for doesn't exist.
              </p>
              <Link to="/orders">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Back to Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
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
          <p className="text-gray-600">Please wait while we fetch your order details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order._id}
              </h1>
              <p className="text-gray-600">
                Placed on
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items &&
                    order.items.map((item) => (
                      <div
                        key={item.productId?._id}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <img
                          src={
                            item.productId?.images[0]
                              ? item.productId.images[0]
                              : "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                          }
                          alt={item.productId?.name}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {item.productId?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Quantity: {item?.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          Rs {item.productId?.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.addressLine}</p>
                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {(order.totalAmount * 0.87).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs {(order.totalAmount * 0.13).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-amber-600">
                      Rs {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.paymentMethod}</p>
              </CardContent>
              <CardContent>
                {order.paymentStatus === "pending" ? (
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                    Payment Pending
                  </Badge>
                ) : (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Payment Completed
                  </Badge>
                )}
              </CardContent>
              <CardContent>
                {order.paymentMethod === "Khalti" &&
                  order.paymentStatus === "pending" && (
                    <Button
                      variant="outline"
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleKhaltiPayment}
                    >
                      Pay With Khalti
                    </Button>
                  )}
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {orderId && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 mr-2" />
                    Shipping Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">Tracking Number</p>
                      <p className="text-gray-600">{order._id}</p>
                    </div>

                    {order.deliveredAt ? (
                      <div>
                        <p className="font-medium">Delivered On</p>
                        <p className="text-green-600">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Delivered On</p>
                        <p className="text-green-600">3-5 Days </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate(`/ordertracking/${order._id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      Track Package
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {order.status === "delivered" && (
                <Button variant="outline" className="w-full">
                  Reorder Items
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
