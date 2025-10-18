# 🚀 Admin Dashboard Setup & Usage Guide

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Admin Access Configuration](#admin-access-configuration)
3. [CRUD Operations](#crud-operations)
4. [Image Upload System](#image-upload-system)
5. [Security Configuration](#security-configuration)
6. [Testing Checklist](#testing-checklist)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Initial Setup

### Prerequisites
- Supabase project connected
- Database migrations applied
- Admin role assigned to your account

### Database Migration Status
✅ Comprehensive RLS policies migration applied
✅ All tables secured with proper access controls
✅ Storage bucket configured for media uploads
✅ Rate limiting infrastructure in place

---

## 🔐 Admin Access Configuration

### Method 1: Passcode-Based Access (Recommended for Quick Access)

The admin passcode is stored securely in Supabase Secrets as `ADMIN_PASSCODE`.

**To set or change the admin passcode:**

1. Go to your Supabase Dashboard
2. Navigate to: [Project Settings > Edge Functions > Secrets](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/settings/functions)
3. Add or update the secret:
   - Name: `ADMIN_PASSCODE`
   - Value: Your secure passcode (minimum 8 characters recommended)
4. Save changes

**How users access admin:**
1. Navigate to `/admin` route on your website
2. If not authenticated, they'll be redirected to a passcode entry modal
3. Enter the admin passcode
4. On success, a 24-hour session token is stored
5. User gains access to the admin dashboard

**Security Features:**
- Passcode verification happens server-side via Edge Function
- Admin session token expires after 24 hours
- No passcode is stored in client code
- Failed attempts are logged for monitoring

### Method 2: Email/Password Authentication

**To add an admin user via email:**

1. Add the email to `admin_emails` table:
```sql
INSERT INTO public.admin_emails (email)
VALUES ('admin@example.com');
```

2. The user creates an account via `/auth` route
3. On signup, if their email is in `admin_emails`, they're automatically assigned admin role
4. They can log in normally and access `/admin`

**To manually assign admin role:**
```sql
-- First, get the user's ID from Supabase Auth
-- Then insert into user_roles
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin'::app_role);
```

---

## ✏️ CRUD Operations

### How Admin CRUD Works

The admin dashboard uses a unified `AdminCrud` component that handles all database operations for different content sections.

**Supported Operations:**
- ✅ Create new records
- ✅ Edit existing records
- ✅ Delete records with confirmation
- ✅ Upload images directly to Supabase Storage
- ✅ Real-time data synchronization

### Create New Entry

1. Navigate to the relevant tab (About, Skills, Education, etc.)
2. Fill in the form on the right side panel
3. For image fields, click "Upload" and select an image from your device
4. Required fields are marked and validated
5. Click "Create" button
6. Success: Toast notification appears, data refreshes automatically
7. Error: Detailed error message shows what went wrong

### Edit Entry

1. In the data table, click the "Edit" button next to the record
2. Form auto-populates with existing data
3. Modify any fields (including uploading new images)
4. Click "Update" button
5. Changes save to database and reflect immediately on public site

### Delete Entry

1. Click "Delete" button next to the record
2. Confirm deletion in the popup dialog
3. Record is permanently removed from database
4. Public site updates automatically

### Data Persistence

**Important:** All operations are confirmed by the database before updating the UI:
- After INSERT: `.select('*')` retrieves the new record
- After UPDATE: `.select('*').maybeSingle()` retrieves updated record
- After DELETE: Table is re-fetched to ensure consistency
- No optimistic updates - UI always reflects true database state

---

## 📸 Image Upload System

### How It Works

The system uses **Supabase Storage** for secure, scalable image hosting.

**Storage Bucket:** `media` (public read access)

**Upload Flow:**
1. Admin selects image from device (desktop or mobile)
2. Image is validated (type, size limit: 10MB)
3. File uploads to `media/<table>/<field>/<timestamp>-<random>.ext`
4. Supabase returns public URL
5. URL is saved to database field
6. Preview thumbnail displays in admin panel

### Supported Sections with Image Upload

| Section | Field Name | Purpose |
|---------|-----------|---------|
| **About** | `image_url` | Profile photo |
| **Projects** | `media_url` | Project screenshot/thumbnail |
| **Hire Links** | _(can be added if needed)_ | Platform logo |

### Adding Image Upload to More Fields

In `src/pages/Admin.tsx`, add to column definitions:

```typescript
const myColumns: ColumnDef[] = [
  // ... other fields
  { key: 'my_image_field', label: 'Image', type: 'image' },
];
```

The `AdminCrud` component automatically renders the `ImageUpload` component for `type: 'image'` fields.

### Image Display on Public Site

Updated components automatically fetch and display database image URLs:
- **About section**: Uses `aboutInfo?.image_url` with fallback
- **Projects**: Uses `project.media_url` directly
- All images use `loading="lazy"` for performance

---

## 🔒 Security Configuration

### Row-Level Security (RLS) Policies

All tables have comprehensive RLS policies applied:

#### Public Content Tables
- **about, skills, education, experience, categories**: 
  - Public can SELECT (read)
  - Only admins can INSERT/UPDATE/DELETE

#### Projects & Hire Links
- **projects**: Public sees only `published = true`, admins see all
- **hire_links**: Public sees only `available = true`, admins see all

#### Sensitive Tables
- **contacts**: 
  - Anyone can INSERT (submit form)
  - Only admins can SELECT/UPDATE/DELETE
- **admin_emails**: 
  - Only admins can access
- **user_roles**: 
  - Users can view their own roles
  - Only admins can manage all roles
- **rate_limits**: 
  - Only service role (Edge Functions) can manage
  - Admins can view for monitoring

### Storage Security

**Media Bucket Policies:**
- Public can view files (GET)
- Only authenticated admins can upload (POST)
- Only authenticated admins can update (PUT)
- Only authenticated admins can delete (DELETE)

### Secrets Management

**Never hardcode secrets in code!** All sensitive data is stored in Supabase Secrets:

| Secret Name | Purpose | Where to Set |
|-------------|---------|--------------|
| `ADMIN_PASSCODE` | Admin access code | Supabase > Settings > Functions |
| `HCAPTCHA_SECRET` | Contact form verification | Supabase > Settings > Functions |
| `RESEND_API_KEY` | Email notifications | Supabase > Settings > Functions |

**To add/update secrets:**
```bash
# Via Supabase CLI
supabase secrets set ADMIN_PASSCODE=your-secure-passcode

# Or via Dashboard:
# Project > Settings > Edge Functions > Secrets
```

### Rate Limiting

Contact form submissions are rate-limited server-side:
- Maximum 3 submissions per hour per IP address
- Enforced in `contact-submit` Edge Function
- Rate limit data stored in `rate_limits` table
- Admins can view rate limit logs in dashboard

---

## ✅ Testing Checklist

### Functional Tests

**Before deploying, verify these workflows:**

#### 1. Admin Access
- [ ] Can access `/admin` with correct passcode
- [ ] Cannot access `/admin` with incorrect passcode
- [ ] Session persists across page refreshes
- [ ] Session expires after 24 hours
- [ ] Logout clears session properly

#### 2. CRUD - Skills
- [ ] Create new skill (e.g., "LLMs", category: "Generative AI", proficiency: 90)
- [ ] Skill appears in admin list immediately
- [ ] Skill appears on public site immediately (refresh if needed)
- [ ] Edit skill name → saves and updates public site
- [ ] Delete skill → removes from database and public site
- [ ] Changes persist after logout and re-login

#### 3. CRUD - About
- [ ] Edit About heading and content → saves successfully
- [ ] Upload profile image → image uploads and displays
- [ ] Image URL saved to database correctly
- [ ] Public About section shows uploaded image
- [ ] Delete About entry (if testing) → removes successfully

#### 4. CRUD - Projects
- [ ] Create project with image upload
- [ ] Toggle `published` status
- [ ] Unpublished projects hidden from public, visible to admin
- [ ] Edit project and change image
- [ ] Old image URL replaced with new one
- [ ] Delete project → completely removed

#### 5. Image Uploads
- [ ] Upload image < 10MB → success
- [ ] Upload image > 10MB → error message shown
- [ ] Upload non-image file → error message shown
- [ ] Preview shows before saving
- [ ] Uploaded image appears on public site
- [ ] Multiple uploads to different sections work

#### 6. Contact Form
- [ ] Submit contact form → record created in `contacts` table
- [ ] Contact visible in Admin > Contacts tab
- [ ] Mark contact as `handled` → updates in database
- [ ] hCaptcha verification works (if configured)
- [ ] Rate limiting prevents spam (test by submitting 4+ times rapidly)

### Security Tests

- [ ] Non-admin users cannot access `/admin` route
- [ ] RLS prevents unauthorized database access
- [ ] Image uploads rejected for non-admin users
- [ ] Passcode is not visible in network requests (encrypted)
- [ ] Admin session token stored securely
- [ ] Rate limiting works for contact submissions

### Performance Tests

- [ ] Admin dashboard loads within 2 seconds
- [ ] CRUD operations complete within 1 second
- [ ] Image uploads < 5MB complete within 5 seconds
- [ ] Public site reflects changes within 2 seconds (after hard refresh)
- [ ] No console errors during normal operations

---

## 🛠 Troubleshooting

### Common Issues & Solutions

#### Issue: "New row violates row-level security policy"

**Cause:** User doesn't have proper permissions (not admin)

**Solution:**
1. Verify user is logged in with admin account
2. Check `user_roles` table:
```sql
SELECT * FROM user_roles WHERE user_id = 'your-user-id';
```
3. If no admin role found, add it:
```sql
INSERT INTO user_roles (user_id, role) VALUES ('your-user-id', 'admin');
```

#### Issue: Edit shows blank screen / no data loads

**Cause:** Form state not properly initialized

**Solution:**
1. Check browser console for errors
2. Verify data exists in database
3. Clear browser cache and localStorage
4. Ensure RLS policies allow SELECT for admin

#### Issue: Deletes appear to work but data reappears

**Cause:** RLS policy denying DELETE operation

**Solution:**
1. Run security scan to verify policies
2. Ensure user has admin role
3. Check database logs for permission errors
4. Verify the migration was applied successfully

#### Issue: Images not uploading

**Cause:** Storage permissions or bucket configuration

**Solution:**
1. Verify `media` bucket exists in Supabase Storage
2. Check bucket is set to `public: true`
3. Verify RLS policies on `storage.objects` table
4. Check file size < 10MB
5. Ensure file is valid image format (jpg, png, webp)

#### Issue: Changes not reflecting on public site

**Cause:** Data not being re-fetched or component using cached data

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Verify the component uses `useSupabaseData` hook
3. Check the component is not using hardcoded fallback data
4. Ensure component re-renders when data changes

#### Issue: Admin passcode not working

**Cause:** Secret not set or Edge Function error

**Solution:**
1. Verify `ADMIN_PASSCODE` is set in Supabase Secrets
2. Check Edge Function logs: [View Logs](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/functions/verify-admin-passcode/logs)
3. Ensure Edge Function is deployed
4. Try resetting the secret and using a new passcode

---

## 📚 Additional Resources

### Supabase Dashboard Links

- **Database Tables**: [View Tables](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/editor)
- **Storage Buckets**: [Manage Storage](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/storage/buckets)
- **Edge Functions**: [View Functions](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/functions)
- **Edge Function Secrets**: [Manage Secrets](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/settings/functions)
- **Authentication Settings**: [Auth Config](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/auth/providers)
- **SQL Editor**: [Run Queries](https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/sql/new)

### Migration Files

All migrations are stored in `supabase/migrations/` and include:
- RLS policy definitions
- Storage bucket configurations
- Security constraints
- Indexes for performance

### Running Security Scan

To verify all security policies are correctly applied:

```bash
# Via Supabase CLI
supabase db lint

# Or use the Lovable security scan tool
```

Expected result: **Zero RLS warnings** for all tables

---

## 🎉 Success Criteria

Your admin system is fully functional when:

✅ All CRUD operations work smoothly  
✅ Image uploads complete successfully  
✅ Changes persist after logout/login  
✅ Public site reflects admin changes immediately  
✅ Security scan shows zero violations  
✅ No console errors during normal use  
✅ Rate limiting prevents abuse  
✅ Admin access properly secured  

---

**Last Updated:** 2025-01-18  
**Migration Version:** Comprehensive RLS v1.0  
**Project:** maheen-ai-studio
