import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";


import Lottie from "lottie-react";

import paymentLoadingAnimation from "../lib/paymentAnimation.json"; // Adjust path as needed
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {token} = useAuth().state;
  const { toast } = useToast();
    const { dispatch } = useCart();
  
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "failed" | "completed"
  >("pending");

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      const paymentData = {
        pidx: searchParams.get("pidx"),
        transaction_id: searchParams.get("transaction_id"),
        tidx: searchParams.get("tidx"),
        amount: searchParams.get("amount"),
        total_amount: searchParams.get("total_amount"),
        mobile: searchParams.get("mobile"),
        status: searchParams.get("status"),
        purchase_order_id: searchParams.get("purchase_order_id"),
        purchase_order_name: searchParams.get("purchase_order_name"),
      };

      if (paymentData.status === "Completed" && paymentData.purchase_order_id && paymentData.pidx) {
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_API_URI}/orders/${paymentData.purchase_order_id}/payment`,
            {
              paymentToken: paymentData.pidx,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setPaymentStatus("completed");
            dispatch({ type: "CLEAR_CART" });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error(
            "Error verifying payment:",
            error.response?.data || error
          );

          toast({
            title: "Payment Verification Failed",
            description: error.response?.data?.message || "An error occurred while verifying your payment.",
            variant: "destructive",
          });
        }
      } else {

toast({
        title: "Payment Failed",
        description: "Your payment could not be verified. Please try again.",
        variant: "destructive",
      });
      setPaymentStatus("failed");
      navigate("/cart");
    }
    };

    if (searchParams.get("pidx")) {
      handlePaymentConfirmation();
    }
  }, [searchParams, token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        {paymentStatus === "pending" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Processing Payment...
            </h2>
            <div className="w-48 h-48 mx-auto">
              <Lottie animationData={paymentLoadingAnimation} loop={true} />
            </div>
            <p className="text-gray-600 mt-4">
              Please wait while we verify your payment.
            </p>
          </>
        )}

        {paymentStatus === "completed" && (
          <>
            <div className="w-100 h-50 mx-auto">
              <Lottie animationData={paymentLoadingAnimation} loop={false} />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600">
              Your order has been confirmed. Thank you for your purchase!
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-1/2 py-1 text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors my-4 text-lg font-semibold"
            >
              Return Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
