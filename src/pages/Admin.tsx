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
import BackgroundCircles from "@/components/ui/BackgroundCircles";
import GradientText from "@/components/ui/GradientText";
import { LogOut, Shield, Database, Users, Brain, Mail, Briefcase, GraduationCap, Folder, Link2, Layers } from "lucide-react";
import type { User, Session } from "@supabase/supabase-js";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (!newSession) {
        navigate('/auth');
      }
    });

    // THEN check for existing session and admin role
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!currentSession) {
          navigate('/auth');
          return;
        }

        setSession(currentSession);
        setUser(currentSession.user);

        // Check admin role
        const { data: hasRole, error: roleError } = await supabase.rpc('has_role', {
          _user_id: currentSession.user.id,
          _role: 'admin'
        });

        if (roleError) {
          console.error('Error checking role:', roleError);
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

        setIsAdmin(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <BackgroundCircles variant="subtle" />
        <div className="text-center relative z-10">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Column definitions
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
    { key: 'published', label: 'Published', type: 'boolean' },
  ];

  const hireLinksColumns: ColumnDef[] = [
    { key: 'platform', label: 'Platform', type: 'text', required: true },
    { key: 'url', label: 'URL', type: 'text', required: true },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'rate', label: 'Rate', type: 'text' },
    { key: 'rating', label: 'Rating', type: 'text' },
    { key: 'projects', label: 'Projects Count', type: 'text' },
    { key: 'available', label: 'Available', type: 'boolean' },
  ];

  return (
    <div className="min-h-screen relative">
      <BackgroundCircles variant="subtle" />
      
      <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <GradientText>Admin Dashboard</GradientText>
              </h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="flex items-center gap-2 glass-panel"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-1 glass-panel p-1 h-auto">
            <TabsTrigger value="about" className="flex items-center gap-2 text-xs md:text-sm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 text-xs md:text-sm">
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-xs md:text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2 text-xs md:text-sm">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 text-xs md:text-sm">
              <Folder className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 text-xs md:text-sm">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="hirelinks" className="flex items-center gap-2 text-xs md:text-sm">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2 text-xs md:text-sm">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2 text-xs md:text-sm">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">About Section</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="about" columns={aboutColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Skills Management</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="skills" columns={skillsColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Education</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="education" columns={educationColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="experience" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Experience</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="experience" columns={experienceColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="categories" columns={categoriesColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Projects</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="projects" columns={projectsColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="hirelinks" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Hire Links</h2>
            </div>
            <ErrorBoundary>
              <AdminCrud table="hire_links" columns={hireLinksColumns} />
            </ErrorBoundary>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">AI Knowledge</h2>
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
