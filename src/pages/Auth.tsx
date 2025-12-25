import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, Lock } from "lucide-react";
import BackgroundCircles from "@/components/ui/BackgroundCircles";
import GradientText from "@/components/ui/GradientText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Auth = () => {
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated with valid token
    const adminToken = localStorage.getItem('adminToken');
    const adminTokenExpiry = localStorage.getItem('adminTokenExpiry');
    
    if (adminToken && adminTokenExpiry) {
      const expiryDate = new Date(adminTokenExpiry);
      if (expiryDate > new Date()) {
        navigate('/admin');
      } else {
        // Token expired, clear it
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminTokenExpiry');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passcode.trim()) {
      toast({
        title: "Passcode required",
        description: "Please enter the admin passcode.",
        variant: "destructive",
      });
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundCircles variant="hero" />
      
      <Card className="w-full max-w-md glass-panel relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            <GradientText as="span">Admin Access</GradientText>
          </CardTitle>
          <CardDescription>
            Enter the admin passcode to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="glass-input pl-10 text-center text-lg tracking-wider"
                disabled={loading}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-premium"
              disabled={loading || !passcode.trim()}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Verifying..." : "Access Dashboard"}
            </Button>
          </form>

          <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Secure admin access • Session expires in 24 hours
            </p>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-primary hover:text-primary/80 transition-colors story-link"
            >
              ← Back to Portfolio
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
