# Deployment Guide - Maheen AI Studio Portfolio

## ✅ COMPLETED FIXES

### 1. Admin CRUD Functionality
- ✅ Fixed boolean field conversions (published, available fields)
- ✅ Proper data refetch after all mutations (create, update, delete)
- ✅ Enhanced error logging for debugging
- ✅ Boolean values properly converted between UI and database
- ✅ Image upload fields now show thumbnails in admin table

### 2. Image Upload System
- ✅ All image URL inputs replaced with ImageUpload component
- ✅ Direct upload to Supabase Storage `media` bucket
- ✅ Preview thumbnails in admin dashboard
- ✅ Image sync fixed with useEffect for value changes
- ✅ Supports desktop and mobile file uploads

### 3. Security & Database
- ✅ Idempotent RLS migration applied
- ✅ Storage bucket policies configured (admin upload, public read)
- ✅ Rate limiting constraints added
- ✅ Admin-only access to sensitive tables
- ✅ Proper index for rate limit queries

### 4. Edge Functions
- ✅ `verify-admin-passcode` - secure passcode verification
- ✅ `contact-submit` - hCaptcha verification, rate limiting, email notifications

---

## 🔴 REQUIRED MANUAL STEPS (Supabase Dashboard)

These security items **MUST** be completed by you in the Supabase Dashboard:

### 1. Enable Leaked Password Protection
1. Go to: https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/auth/providers
2. Navigate to **Auth > Password Security**
3. Enable **Leaked Password Protection**
4. Documentation: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

### 2. Upgrade Postgres Version
1. Go to: https://supabase.com/dashboard/project/urpekpxpvoaqagdjyerm/settings/infrastructure
2. Navigate to **Settings > Infrastructure**
3. Follow the upgrade wizard for Postgres
4. ⚠️ **Schedule during low-traffic period** (brief downtime expected)
5. Documentation: https://supabase.com/docs/guides/platform/upgrading

---

## 🧪 TESTING CHECKLIST

### Admin CRUD Testing
- [ ] **Create** a new Education entry → appears immediately in list and on public site
- [ ] **Edit** an About entry → changes save and display correctly
- [ ] **Delete** a Skill/Project → removed from DB and public site (persists after logout)
- [ ] **Upload** profile image → replaces placeholder on public site
- [ ] **Toggle** published/available fields → properly saved as boolean

### Image Upload Testing
- [ ] Upload image from desktop → preview shows, URL saved
- [ ] Upload image from mobile → works correctly
- [ ] Remove uploaded image → clears from form
- [ ] Image displays on public portfolio after save

### Security Testing
- [ ] Contact form submission with rate limiting (3 max per hour)
- [ ] Admin passcode verification works
- [ ] Non-admin users cannot access `/admin` route
- [ ] RLS policies prevent unauthorized data access

### Frontend Sync Testing
- [ ] Edit data in admin → immediately visible on public site (no logout needed)
- [ ] Delete item in admin → immediately removed from public site
- [ ] Upload image → immediately displays in public portfolio

---

## 📋 ACCEPTANCE CRITERIA EVIDENCE

**Required Screenshots/Videos:**
1. Admin CRUD flow (create, edit, delete)
2. Image upload from device → public site display
3. Contact form submission → admin notification
4. Supabase security scan showing **0 RLS warnings** for contacts/admin_emails/user_roles
5. Before/After screenshots of Leaked Password Protection and Postgres version

---

## 🔐 ENVIRONMENT CONFIGURATION

### Supabase Secrets (Already Configured)
- ✅ `ADMIN_PASSCODE` - Admin authentication
- ✅ `RESEND_API_KEY` - Email notifications
- ✅ `HCAPTCHA_SECRET` - Captcha verification
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Edge function access
- ✅ `SUPABASE_URL` - Database URL

### Storage Bucket
- ✅ Bucket: `media`
- ✅ Public read access
- ✅ 10MB file size limit
- ✅ Image types: JPEG, PNG, WEBP, GIF

---

## 🚀 DEPLOYMENT STEPS

1. **Complete Manual Security Steps** (see above)
2. **Run Security Scan**:
   ```
   Verify all RLS policies are working correctly
   ```
3. **Test All CRUD Operations**:
   - Create, Update, Delete in each admin section
   - Verify public site updates immediately
4. **Test Image Uploads**:
   - Upload images in About, Projects sections
   - Verify display on public site
5. **Deploy to Production**:
   - Use Lovable's "Publish" button
   - Configure custom domain if needed

---

## 📖 ADMIN USAGE GUIDE

### How to Change Admin Passcode
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Update `ADMIN_PASSCODE` value
3. Changes take effect immediately

### How to Upload Images
1. Navigate to Admin Dashboard → Select section (About, Projects, etc.)
2. Click "Upload" button in image field
3. Select image from device (max 10MB)
4. Preview shows immediately
5. Click "Create" or "Update" to save

### How to View Contact Submissions
1. Navigate to Admin Dashboard → Contacts tab
2. Mark as "Done" when handled
3. Delete spam submissions if needed

---

## 🐛 TROUBLESHOOTING

### Images Not Uploading
- Check storage bucket permissions in Supabase Dashboard
- Verify file size is under 10MB
- Ensure file type is JPEG, PNG, WEBP, or GIF

### Admin CRUD Not Syncing
- Check browser console for errors
- Verify RLS policies are enabled
- Confirm admin role is assigned correctly

### Contact Form Failing
- Verify `RESEND_API_KEY` is configured
- Check hCaptcha secret is set correctly
- Review rate limit table for blocks

---

## 📝 MIGRATION SQL (Applied)

The following idempotent migration was successfully applied:

```sql
-- Storage bucket configuration
-- RLS policies for media bucket
-- Rate limiting constraints
-- Admin email policies
-- Index optimizations
```

**Migration File**: Check Supabase Dashboard → SQL Editor → History

---

## ✨ WHAT'S NEXT

After completing the manual security steps and testing:

1. **Performance Optimization**:
   - Add optimistic UI updates
   - Implement image lazy loading
   - Enable caching for static assets

2. **Optional Enhancements**:
   - Drag-and-drop image upload
   - Admin activity log
   - Automated tests for CRUD flows

3. **Monitoring**:
   - Set up error tracking
   - Monitor contact form submissions
   - Track image upload success rates

---

**Questions or Issues?** Review the troubleshooting section or check Edge Function logs in Supabase Dashboard.
