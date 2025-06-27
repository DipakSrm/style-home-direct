
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin, CreditCard } from "lucide-react";

const OrderDetails = () => {
  const { orderId } = useParams();

  // Mock detailed order data
  const mockOrderDetails = {
    "ORD-001": {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1299.00,
      subtotal: 1299.00,
      shipping: 0.00,
      tax: 0.00,
      items: [
        { 
          id: "1",
          name: "Modern Velvet Sofa", 
          quantity: 1, 
          price: 1299.00,
          image: "/placeholder.svg"
        }
      ],
      shippingAddress: {
        name: "John Doe",
        phone: "+1 (555) 123-4567",
        addressLine: "123 Main Street",
        city: "New York",
        postalCode: "10001",
        country: "United States"
      },
      paymentMethod: "Credit Card ending in 4567",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-15",
      deliveredAt: "2024-01-15"
    },
    "ORD-002": {
      id: "ORD-002",
      date: "2024-01-20",
      status: "shipped",
      total: 899.00,
      subtotal: 899.00,
      shipping: 0.00,
      tax: 0.00,
      items: [
        { 
          id: "2",
          name: "Scandinavian Dining Table", 
          quantity: 1, 
          price: 899.00,
          image: "/placeholder.svg"
        }
      ],
      shippingAddress: {
        name: "Jane Smith",
        phone: "+1 (555) 987-6543",
        addressLine: "456 Oak Avenue",
        city: "Los Angeles",
        postalCode: "90210",
        country: "United States"
      },
      paymentMethod: "Credit Card ending in 9876",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-28"
    }
  };

  const order = mockOrderDetails[orderId as keyof typeof mockOrderDetails];

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
              <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
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
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {order.status === 'delivered' ? 'Delivered' :
               order.status === 'shipped' ? 'Shipped' : 'Processing'}
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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${item.price.toFixed(2)}</p>
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
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
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
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-amber-600">${order.total.toFixed(2)}</span>
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
            </Card>

            {/* Tracking Information */}
            {order.trackingNumber && (
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
                      <p className="text-gray-600">{order.trackingNumber}</p>
                    </div>
                    {order.estimatedDelivery && !order.deliveredAt && (
                      <div>
                        <p className="font-medium">Estimated Delivery</p>
                        <p className="text-gray-600">
                          {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {order.deliveredAt && (
                      <div>
                        <p className="font-medium">Delivered On</p>
                        <p className="text-green-600">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <Link to="/track-order">
                      <Button variant="outline" className="w-full">
                        Track Package
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="mt-6 space-y-3">
              {order.status === 'delivered' && (
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
