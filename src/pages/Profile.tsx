import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { IAddress, IUser } from "@/lib/types";
import axios from "axios";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, token, loading } = useAuth().state;

  const [userResponse, setUserResponse] = useState<IUser | null>(null);
  const [isAddress, setIsAddress] = useState<boolean>(false);
  const [addressResponse, setAddressResponse] = useState<IAddress | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addressData, setAddressData] = useState<Partial<IAddress>>({
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);

  // Fetch user details from server
  useEffect(() => {
    if (user && isAuthenticated && token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URI}/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setUserResponse(response.data.user);
          } else {
            toast({
              title: "Error",
              description: "Failed to fetch user data.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch user data.",
            variant: "destructive",
          });
        }
      };

      const fetchAddressData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URI}/addresses/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200 && response.data.data.length > 0) {
            setAddressResponse(response.data.data[0]);
            setAddressData(response.data.data[0]);
            setIsAddress(true);
          }
        } catch (error) {
          console.error("Error fetching address data:", error);
          setIsAddress(false);
        }
      };

      fetchUserData();
      fetchAddressData();
    }
  }, [user, isAuthenticated, token, toast]);

  // Sync form with fetched user data
  useEffect(() => {
    if (userResponse) {
      setProfileData({
        firstName: userResponse.name?.split(" ")[0] || "",
        lastName: userResponse.name?.split(" ")[1] || "",
        email: userResponse.email || "",
        phone: userResponse.phone || "",
      });
    }
  }, [userResponse]);

  const submitProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_URI}/users/me/${userResponse?._id}`,
        {
          name: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          phone: profileData.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserResponse(response.data.data);
        toast({
          title: "Profile updated!",
          description:
            "Your profile information has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  const submitAddressCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URI}/addresses/`,
        {
          addressLine: addressData.addressLine,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setAddressResponse(response.data.data);
        setIsAddress(true);
        setShowAddressForm(false);
        toast({
          title: "Address created!",
          description: "Your shipping address has been successfully created.",
        });
      }
    } catch (error) {
      console.error("Error creating address:", error);
      toast({
        title: "Error",
        description: "Failed to create address.",
        variant: "destructive",
      });
    }
  };

  const submitAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_URI}/addresses/${addressResponse?._id}`,
        {
          addressLine: addressData.addressLine,
          city: addressData.city,
          state: addressData.state,
          postalCode: addressData.postalCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAddressResponse(response.data.data);
        toast({
          title: "Address updated!",
          description: "Your shipping address has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast({
        title: "Error",
        description: "Failed to update address.",
        variant: "destructive",
      });
    }
  };

  // Show loading while user data is loading
  if (loading || !userResponse) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                {!isAddress && !showAddressForm ? (
                  <Button
                    onClick={() => setShowAddressForm(true)}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Add Address
                  </Button>
                ) : (
                  <form
                    onSubmit={
                      isAddress ? submitAddressUpdate : submitAddressCreate
                    }
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="addressLine">Street Address</Label>
                      <Input
                        id="addressLine"
                        value={addressData.addressLine || ""}
                        onChange={(e) =>
                          setAddressData({
                            ...addressData,
                            addressLine: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={addressData.city || ""}
                          onChange={(e) =>
                            setAddressData({
                              ...addressData,
                              city: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">Province</Label>
                        <Select
                          value={addressData.state}
                          onValueChange={(value) =>
                            setAddressData({
                              ...addressData,
                              state: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="province-1">
                              Province 1
                            </SelectItem>
                            <SelectItem value="province-2">
                              Province 2
                            </SelectItem>
                            <SelectItem value="bagmati">
                              Bagmati Province
                            </SelectItem>
                            <SelectItem value="gandaki">
                              Gandaki Province
                            </SelectItem>
                            <SelectItem value="lumbini">
                              Lumbini Province
                            </SelectItem>
                            <SelectItem value="karnali">
                              Karnali Province
                            </SelectItem>
                            <SelectItem value="sudurpashchim">
                              Sudurpashchim Province
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">ZIP Code</Label>
                        <Input
                          id="postalCode"
                          value={addressData.postalCode || ""}
                          onChange={(e) =>
                            setAddressData({
                              ...addressData,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {isAddress ? "Update Address" : "Create Address"}
                    </Button>
                    {!isAddress && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="ml-2"
                      >
                        Cancel
                      </Button>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Change Password
                  </h3>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Update Password
                    </Button>
                  </form>
                </div>
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">
                    Account Actions
                  </h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      Download Account Data
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
