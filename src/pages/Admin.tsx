const Admin = () => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <section className="container max-w-xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Panel</h1>
        <p className="text-muted-foreground mb-6">
          Supabase is required for authentication and content management. Connect Supabase to enable the admin dashboard, data editing, and contact submissions.
        </p>
        <a className="story-link" href="https://docs.lovable.dev/integrations/supabase/" target="_blank" rel="noreferrer">Read how to connect Supabase</a>
      </section>
    </main>
  );
};

export default Admin;
