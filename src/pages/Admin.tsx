import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminCrud, { type ColumnDef } from "@/pages/admin/components/AdminCrud";
import KnowledgeTrainer from "@/pages/admin/components/KnowledgeTrainer";
import ContactsManager from "@/pages/admin/components/ContactsManager";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { LogOut, Shield, Database, Users, Brain, Mail } from "lucide-react";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for passcode-based admin session
        const adminToken = localStorage.getItem('adminToken');
        const adminTokenExpiry = localStorage.getItem('adminTokenExpiry');
        
        if (adminToken && adminTokenExpiry) {
          const expiryDate = new Date(adminTokenExpiry);
          if (expiryDate > new Date()) {
            setAllowed(true);
            setLoading(false);
            return;
          } else {
            // Token expired, clear it
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExpiry');
          }
        }

        // Fallback to email/password authentication
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }

        // Check if user has admin role
        const { data: hasRole, error } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('Error checking role:', error);
          toast({
            title: "Access Error",
            description: "Failed to verify admin access.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (!hasRole) {
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this page.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        setAllowed(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    // Clear passcode session
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
    
    // Also sign out from Supabase auth if logged in
    await supabase.auth.signOut();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  // Column definitions for each table
  const aboutColumns: ColumnDef[] = [
    { key: 'heading', label: 'Heading', type: 'text', required: true },
    { key: 'content', label: 'Content', type: 'textarea' },
    { key: 'image_url', label: 'Profile Image', type: 'image' },
  ];

  const skillsColumns: ColumnDef[] = [
    { key: 'skill_name', label: 'Skill Name', type: 'text', required: true },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'proficiency', label: 'Proficiency (0-100)', type: 'number' },
  ];

  const educationColumns: ColumnDef[] = [
    { key: 'institution', label: 'Institution', type: 'text', required: true },
    { key: 'degree', label: 'Degree', type: 'text' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ];

  const experienceColumns: ColumnDef[] = [
    { key: 'company', label: 'Company', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'start_date', label: 'Start Date', type: 'date' },
    { key: 'end_date', label: 'End Date', type: 'date' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ];

  const categoriesColumns: ColumnDef[] = [
    { key: 'name', label: 'Category Name', type: 'text', required: true },
  ];

  const projectsColumns: ColumnDef[] = [
    { key: 'title', label: 'Title', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'category_id', label: 'Category', type: 'select', optionsSource: { table: 'categories', value: 'id', label: 'name' } },
    { key: 'media_url', label: 'Project Image', type: 'image' },
    { key: 'link_url', label: 'Link URL', type: 'text' },
    { key: 'published', label: 'Published', type: 'select', options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] },
  ];

  const hireLinksColumns: ColumnDef[] = [
    { key: 'platform', label: 'Platform', type: 'text', required: true },
    { key: 'url', label: 'URL', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'rate', label: 'Rate', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'text' },
    { key: 'projects', label: 'Projects Count', type: 'text' },
    { key: 'available', label: 'Available', type: 'select', options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] },
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold title-gradient">Admin Dashboard</h1>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 glass-panel">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="hirelinks">Hire Links</TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Knowledge
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">About Section Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="about" columns={aboutColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Skills Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="skills" columns={skillsColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Education Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="education" columns={educationColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Experience Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="experience" columns={experienceColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Categories Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="categories" columns={categoriesColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Projects Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="projects" columns={projectsColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="hirelinks" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Hire Links Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="hire_links" columns={hireLinksColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">AI Assistant Knowledge</h2>
            </div>
            <ErrorBoundary>
              <KnowledgeTrainer />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact Submissions</h2>
            </div>
            <ErrorBoundary>
              <ContactsManager />
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;