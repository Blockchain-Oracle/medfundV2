
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { X, CreditCard, Wallet, Heart, Shield, Info } from "lucide-react";
import { toast } from "sonner";

interface DonationFormProps {
  campaign: {
    id: number;
    title: string;
    organizer: string;
  };
  onClose: () => void;
}

const DonationForm = ({ campaign, onClose }: DonationFormProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [anonymous, setAnonymous] = useState(false);
  const [tipAmount, setTipAmount] = useState("0");
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const handleDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "stripe") {
        // Simulate Stripe payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success(`Thank you for your $${donationAmount} donation!`);
        onClose();
      } else if (paymentMethod === "crypto") {
        // Simulate crypto payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Crypto payment initiated! Please complete in your wallet.");
        onClose();
      }
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = parseFloat(donationAmount || "0") + parseFloat(tipAmount || "0");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-2xl flex items-center">
            <Heart className="h-6 w-6 mr-2 text-red-500" />
            Make a Donation
          </CardTitle>
          <CardDescription>
            Support "{campaign.title}" organized by {campaign.organizer}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Donation Amount */}
          <div>
            <Label htmlFor="amount" className="text-base font-semibold">
              Donation Amount (AUD)
            </Label>
            <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
              {predefinedAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={donationAmount === amount.toString() ? "default" : "outline"}
                  onClick={() => setDonationAmount(amount.toString())}
                  className="h-12"
                >
                  A{amount}
                </Button>
              ))}
            </div>
            
            <Input
              id="amount"
              type="number"
              placeholder="Enter custom amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="text-lg h-12"
            />
          </div>

          {/* Platform Tip */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-semibold">Support MedFund Platform (Optional)</Label>
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Help us keep the platform running and support more medical campaigns.
            </p>
            
            <RadioGroup value={tipAmount} onValueChange={setTipAmount} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0" id="tip-0" />
                <Label htmlFor="tip-0">A0</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="tip-5" />
                <Label htmlFor="tip-5">A5</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10" id="tip-10" />
                <Label htmlFor="tip-10">A10</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="15" id="tip-15" />
                <Label htmlFor="tip-15">A15</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-base font-semibold">Payment Method</Label>
            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stripe" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Payment
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Cryptocurrency
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stripe" className="mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Secure Payment with Stripe</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your payment information is encrypted and secure. We accept Visa, Mastercard, American Express, and more.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Cryptocurrency Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Support with Bitcoin, Ethereum, or other cryptocurrencies. You'll be redirected to complete the transaction.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Privacy Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(checked === true)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Make this donation anonymous
            </Label>
          </div>

          {/* Total Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Donation Amount:</span>
              <span className="font-semibold">A{donationAmount || "0"}</span>
            </div>
            {parseFloat(tipAmount) > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span>Platform Tip:</span>
                <span className="font-semibold">A{tipAmount}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg">A{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleDonation}
              disabled={isProcessing || !donationAmount}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? "Processing..." : `Donate A${totalAmount.toFixed(2)}`}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your donation is secure and encrypted. Funds go directly to the campaign organizer.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationForm;
