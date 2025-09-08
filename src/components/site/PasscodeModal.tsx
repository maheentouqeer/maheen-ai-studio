import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield } from "lucide-react";

interface PasscodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasscodeModal = ({ open, onOpenChange }: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);

    try {
      // Call our secure edge function to verify passcode
      const { data, error } = await supabase.functions.invoke('verify-passcode', {
        body: { passcode: passcode.trim() }
      });

      if (error) {
        console.error('Passcode verification error:', error);
        toast({
          title: "Verification Failed",
          description: "Invalid passcode. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        // Store admin session in localStorage for this session
        localStorage.setItem('adminToken', data.adminToken);
        localStorage.setItem('adminTokenExpiry', data.expiresAt);
        
        toast({
          title: "Access Granted",
          description: "Welcome to the admin dashboard!",
        });
        
        onOpenChange(false);
        setPasscode("");
        navigate('/admin');
      } else {
        toast({
          title: "Access Denied",
          description: data.error || "Invalid passcode.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error verifying passcode:', error);
      toast({
        title: "Verification Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl title-gradient">Admin Access</DialogTitle>
          <DialogDescription>
            Enter the admin passcode to access the dashboard
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="passcode">Passcode</Label>
            <Input
              id="passcode"
              type="password"
              placeholder="Enter admin passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              className="glass-input text-center text-lg font-mono tracking-widest"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                setPasscode("");
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-gradient"
              disabled={loading || !passcode.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Access
            </Button>
          </div>
        </form>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            This is a secure admin access point. Only authorized personnel should have the passcode.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasscodeModal;