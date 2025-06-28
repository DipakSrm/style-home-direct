
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderData, setOrderData] = useState<any>(null);

  // Mock tracking data
  const mockTrackingData = {
    "ORD-001": {
      id: "ORD-001",
      status: "delivered",
      estimatedDelivery: "2024-01-15",
      trackingSteps: [
        { status: "Order Placed", date: "2024-01-10", completed: true },
        { status: "Processing", date: "2024-01-11", completed: true },
        { status: "Shipped", date: "2024-01-13", completed: true },
        { status: "Out for Delivery", date: "2024-01-15", completed: true },
        { status: "Delivered", date: "2024-01-15", completed: true }
      ]
    },
    "ORD-002": {
      id: "ORD-002",
      status: "shipped",
      estimatedDelivery: "2024-01-28",
      trackingSteps: [
        { status: "Order Placed", date: "2024-01-20", completed: true },
        { status: "Processing", date: "2024-01-21", completed: true },
        { status: "Shipped", date: "2024-01-23", completed: true },
        { status: "Out for Delivery", date: "", completed: false },
        { status: "Delivered", date: "", completed: false }
      ]
    }
  };

  const handleTrackOrder = () => {
    const data = mockTrackingData[trackingNumber as keyof typeof mockTrackingData];
    setOrderData(data || null);
  };

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) return <Clock className="h-4 w-4 text-gray-400" />;
    
    switch (status) {
      case "Order Placed":
        return <Package className="h-4 w-4 text-green-600" />;
      case "Shipped":
      case "Out for Delivery":
        return <Truck className="h-4 w-4 text-green-600" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your shipment</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tracking">Order Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="tracking"
                    placeholder="Enter order number (e.g., ORD-001)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button onClick={handleTrackOrder} className="bg-amber-600 hover:bg-amber-700">
                    Track Order
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {orderData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{orderData.id}</CardTitle>
                <Badge className={
                  orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  orderData.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {orderData.status === 'delivered' ? 'Delivered' :
                   orderData.status === 'shipped' ? 'Shipped' : 'Processing'}
                </Badge>
              </div>
              {orderData.status !== 'delivered' && (
                <p className="text-sm text-gray-600">
                  Estimated delivery: {new Date(orderData.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orderData.trackingSteps.map((step: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status, step.completed)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-sm text-gray-500">{step.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {trackingNumber && !orderData && (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
              <p className="text-gray-600">Please check your order number and try again.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
