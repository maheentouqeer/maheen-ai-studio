import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCrud from "./admin/components/AdminCrud";
import KnowledgeTrainer from "./admin/components/KnowledgeTrainer";
import ContactsManager from "./admin/components/ContactsManager";

const Admin = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) {
        nav('/auth');
        return;
      }
      (async () => {
        try {
          const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: session.user.id, _role: 'admin' });
          if (!isAdmin) nav('/'); else setAllowed(true);
        } catch {
          nav('/');
        } finally {
          setLoading(false);
        }
      })();
    }).data.subscription;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        nav('/auth');
        setLoading(false);
      }
    });

    return () => sub.unsubscribe();
  }, [nav]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <section className="container max-w-xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Checking access…</h1>
        </section>
      </main>
    );
  }

  if (!allowed) return null;

  return (
    <main className="min-h-screen py-10">
      <section className="container">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Admin Panel</h1>
        <Tabs defaultValue="about">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="knowledge">Assistant Knowledge</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AdminCrud
              table="about"
              columns={[
                { key: 'heading', label: 'Heading', type: 'text', required: true },
                { key: 'content', label: 'Content', type: 'textarea' },
                { key: 'image_url', label: 'Image URL', type: 'text' },
              ]}
            />
          </TabsContent>

          <TabsContent value="skills">
            <AdminCrud
              table="skills"
              columns={[
                { key: 'skill_name', label: 'Skill', type: 'text', required: true },
                { key: 'category', label: 'Category', type: 'text' },
                { key: 'proficiency', label: 'Proficiency', type: 'number' },
              ]}
            />
          </TabsContent>

          <TabsContent value="education">
            <AdminCrud
              table="education"
              columns={[
                { key: 'institution', label: 'Institution', type: 'text', required: true },
                { key: 'degree', label: 'Degree', type: 'text' },
                { key: 'start_date', label: 'Start Date', type: 'date' },
                { key: 'end_date', label: 'End Date', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
            />
          </TabsContent>

          <TabsContent value="experience">
            <AdminCrud
              table="experience"
              columns={[
                { key: 'company', label: 'Company', type: 'text', required: true },
                { key: 'role', label: 'Role', type: 'text' },
                { key: 'start_date', label: 'Start Date', type: 'date' },
                { key: 'end_date', label: 'End Date', type: 'date' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
            />
          </TabsContent>

          <TabsContent value="categories">
            <AdminCrud
              table="categories"
              columns={[
                { key: 'name', label: 'Name', type: 'text', required: true },
              ]}
            />
          </TabsContent>

          <TabsContent value="projects">
            <AdminCrud
              table="projects"
              columns={[
                { key: 'title', label: 'Title', type: 'text', required: true },
                { key: 'description', label: 'Description', type: 'textarea' },
                { key: 'category_id', label: 'Category', type: 'select', optionsSource: { table: 'categories', value: 'id', label: 'name' } },
                { key: 'media_url', label: 'Media URL', type: 'text' },
                { key: 'link_url', label: 'Link URL', type: 'text' },
                { key: 'published', label: 'Published', type: 'select', options: [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }] },
              ]}
            />
          </TabsContent>

          <TabsContent value="knowledge">
            <KnowledgeTrainer />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsManager />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Admin;
