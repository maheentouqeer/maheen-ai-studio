import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PasscodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasscodeModal = ({ open, onOpenChange }: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-passcode', {
        body: { passcode }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        // Store admin token in localStorage
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
          description: data.error || "Invalid passcode",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Passcode verification error:', error);
      toast({
        title: "Access Denied",
        description: "Invalid passcode or server error",
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
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold">Admin Access</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the admin passcode to access the dashboard
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter admin passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="glass-input text-center text-lg tracking-wider"
              disabled={loading}
              autoFocus
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setPasscode("");
              }}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-premium"
              disabled={loading || !passcode.trim()}
            >
              {loading ? "Verifying..." : "Access"}
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          🔒 Secure admin access • Session expires in 24 hours
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default PasscodeModal;