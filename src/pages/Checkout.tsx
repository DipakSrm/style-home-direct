
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { set } from "date-fns";
import axios from "axios";

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { user,isAuthenticated,token } = useAuth().state;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Khalti'>('COD');
console.log(user,"userdaatra");
const [formData, setFormData] = useState({
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  phone: "",
});
useEffect(() => {
  if (user) {
    setFormData({
      email: user.email || "",
      firstName: user.name?.split(" ")[0] || "",
      lastName: user.name?.split(" ")[1] || "",
      address: user.AddressData?.addressLine || "",
      city: user.AddressData?.city || "",
      state: user.AddressData?.state || "",
      zipCode: user.AddressData?.postalCode || "",
      phone: user.phone || "",
    });
  }
}, [user]);
  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsProcessing(true);
    e.preventDefault();
    console.log("formData",formData,state);
    if(!token) return toast({
      title: "Authentication Error",
      description: "You need to be logged in to complete the checkout.",
      variant: "destructive",
    });
try {
 
  const res = await axios.post(
    `${import.meta.env.VITE_API_URI}/orders`,
    {
      items: state.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      })),
      totalAmount: parseFloat((state.total * 1.13).toFixed(2)), // Including tax
      shippingAddress: {
        name: formData.firstName.concat(" ", formData.lastName),
        addressLine: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.zipCode,
        phone: formData.phone,
        country: "Nepal",
      },
      paymentMethod,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if(res.status === 201 && paymentMethod === 'Khalti') {
    // Clear cart after successful order
  
    try {
   
      const response = await axios.post(
        `${import.meta.env.VITE_API_URI}/payment/khalti/initiate`,
        {
          return_url: "http://sharmafurnitres.verce.app/orderConfirmation",
          website_url: "http://sharmafurniture.vercel.app/",
          amount: parseInt((state.total * 1.13 * 100).toFixed(2)), 
          purchase_order_id: res.data.data._id,
          purchase_order_name: `${user.name} Order #${res.data.data._id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if(response.status === 200){
     
        window.open(response.data.payment_url);

      }
    } catch (error) {
      console.log("Error while payment cart:", error);
      setIsProcessing(false);
    }
  
  }
else if(res.status === 201 && paymentMethod === 'COD') {
    // Clear cart after successful order
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Order Placed Successfully",
      description: "Your order has been placed successfully. You will receive a confirmation soon.",
      variant: "default",
    });
    navigate('/orders');
  }
} catch (error) {
  console.log("Error during checkout:", error);
}


    // Simulate payment processing
   
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Province</Label>
                      <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="province-1">Province 1</SelectItem>
                          <SelectItem value="province-2">Province 2</SelectItem>
                          <SelectItem value="bagmati">Bagmati Province</SelectItem>
                          <SelectItem value="gandaki">Gandaki Province</SelectItem>
                          <SelectItem value="lumbini">Lumbini Province</SelectItem>
                          <SelectItem value="karnali">Karnali Province</SelectItem>
                          <SelectItem value="sudurpashchim">Sudurpashchim Province</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'COD' | 'Khalti')}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="COD" id="COD" />
                      <Label htmlFor="COD" className="flex-grow cursor-pointer">
                        <div>
                          <div className="font-semibold">Cash on Delivery (COD)</div>
                          <div className="text-sm text-gray-600">Pay when your order arrives</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="Khalti" id="Khalti" />
                      <Label htmlFor="Khalti" className="flex-grow cursor-pointer">
                        <div>
                          <div className="font-semibold">Khalti Digital Wallet</div>
                          <div className="text-sm text-gray-600">Pay securely with Khalti</div>
                        </div>
                      </Label>
                      <div className="text-purple-600 font-bold text-lg">khalti</div>
                    </div>
                  </RadioGroup>
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
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <div key={item.productId._id} className="flex items-center space-x-4">
                        <img 
                          src={item.productId.images[0] || "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"} 
                          alt={item.productId.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h4 className="font-semibold">{item.productId.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">Rs {(item.productId.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>Rs {state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>Rs {(state.total * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-amber-600">Rs {(state.total * 1.13).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 mt-6"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : `Complete Order (${paymentMethod === 'COD' ? 'COD' : 'Khalti'})`}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">
                      By clicking "Complete Order", you agree to our terms and conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
