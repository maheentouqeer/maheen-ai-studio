# Admin CRUD QA Testing Guide

## Overview
This guide provides step-by-step instructions to test all admin CRUD functionality and verify that changes persist correctly on the public site.

## Prerequisites
1. Access to admin dashboard (use admin passcode or login credentials)
2. Access to public portfolio site
3. Browser with developer tools (optional, for debugging)

## Testing Scenarios

### A. About Section Tests

#### Test 1: Create About Entry
1. **Access Admin Dashboard**
   - Navigate to `/admin`
   - Enter admin passcode or login credentials
   - Click on "About" tab

2. **Create New Entry**
   - Click "Create" button (should show form on right side)
   - Fill in required fields:
     - Heading: "About Me" (required)
     - Content: "Passionate AI engineer..." (optional)
     - Profile Image: Upload using new image upload component
   - Click "Create" button
   - **Expected**: Success toast, new entry appears in table immediately

3. **Verify on Public Site**
   - Open new tab/window to public site (`/`)
   - Navigate to About section
   - **Expected**: New heading and content visible, uploaded image displayed

#### Test 2: Edit About Entry
1. **Edit Existing Entry**
   - In Admin → About, click "Edit" on existing entry
   - Form should populate with existing data (no blank screen)
   - Change heading to "About Maheen"
   - Upload new profile image
   - Click "Update"
   - **Expected**: Success toast, table reflects changes immediately

2. **Verify Persistence**
   - Refresh admin page
   - **Expected**: Changes still visible in admin
   - Check public site
   - **Expected**: Changes reflected on public site

#### Test 3: Delete About Entry
1. **Delete Entry**
   - Click "Delete" on an entry
   - **Expected**: Confirmation dialog appears
   - Confirm deletion
   - **Expected**: Success toast, entry removed from table

2. **Verify Deletion**
   - Refresh admin page
   - **Expected**: Entry still gone
   - Check public site
   - **Expected**: Content no longer visible

### B. Projects Section Tests

#### Test 4: Create Project with Image
1. **Access Projects Tab**
   - Click "Projects" tab in admin
   - Click "Create" button

2. **Fill Project Form**
   - Title: "New AI Project" (required)
   - Description: "Description of project"
   - Category: Select from dropdown
   - Project Image: Upload image using upload component
   - Link URL: "https://example.com"
   - Published: "Yes"
   - Click "Create"

3. **Verify Creation**
   - **Expected**: Success toast, project in table
   - Check public site projects section
   - **Expected**: New project visible with uploaded image

#### Test 5: Bulk Operations Test
1. **Create Multiple Entries**
   - Create 3 projects rapidly
   - Edit 1 project
   - Delete 1 project
   - **Expected**: All operations work without errors

2. **Verify Consistency**
   - Logout from admin
   - Check public site
   - **Expected**: All changes reflected correctly

### C. Image Upload Tests

#### Test 6: Desktop Image Upload
1. **Upload from Computer**
   - Select image field in any form
   - Click "Upload Image" button
   - Select image from computer (ensure < 10MB)
   - **Expected**: Upload progress, preview shows, success toast

2. **Verify Upload**
   - Image should appear in preview
   - Save the entry
   - Check public site
   - **Expected**: Image displays correctly and loads fast

#### Test 7: Mobile Image Upload (Simulation)
1. **Test Mobile Upload**
   - Open developer tools
   - Switch to mobile device simulation
   - Access admin on mobile view
   - Try uploading image
   - **Expected**: Upload button works, can select from gallery or camera

### D. Error Handling Tests

#### Test 8: Network Error Handling
1. **Simulate Network Issues**
   - Disconnect internet briefly during save operation
   - **Expected**: Error toast displayed, user stays on admin page (no blank screen)

2. **Test Large File Upload**
   - Try uploading image > 10MB
   - **Expected**: Error message about file size, upload blocked

#### Test 9: Data Validation Tests
1. **Test Required Fields**
   - Try creating entry without required fields
   - **Expected**: Validation error, form highlights missing fields

2. **Test Invalid Data**
   - Try entering invalid URLs, dates, etc.
   - **Expected**: Appropriate error messages

### E. Performance Tests

#### Test 10: Load Time Test
1. **Admin Dashboard Load**
   - Navigate to admin dashboard
   - **Expected**: Loads within 3 seconds, no blank screens

2. **Large Dataset Test**
   - Create 20+ entries in any section
   - **Expected**: Admin table still loads quickly, pagination works if needed

## Success Criteria Checklist

- [ ] All CRUD operations (Create, Read, Update, Delete) work correctly
- [ ] Changes persist after logout/login
- [ ] No blank screens during edit operations
- [ ] Image uploads work on desktop and mobile
- [ ] Uploaded images display correctly on public site
- [ ] Error messages are user-friendly (no technical errors shown to user)
- [ ] Success/error toasts appear for all operations
- [ ] Public site reflects admin changes immediately
- [ ] Confirmation dialogs appear for destructive actions
- [ ] Form validation works for required fields
- [ ] Large file uploads are properly rejected
- [ ] Admin interface is responsive on mobile devices

## Troubleshooting Common Issues

### Issue: Blank Screen on Edit
- **Solution**: Check browser console for errors, refresh page, try different browser

### Issue: Images Not Uploading
- **Solution**: Check file size (<10MB), ensure valid image format, check network connection

### Issue: Changes Not Reflecting on Public Site
- **Solution**: Hard refresh public site (Ctrl+F5), check if caching is involved

### Issue: Delete Not Working
- **Solution**: Check confirmation dialog appears, verify admin permissions, check network tab for failed requests

## Technical Notes for Developers

### Key Files Modified
- `src/components/ui/ImageUpload.tsx` - New image upload component
- `src/pages/admin/components/AdminCrud.tsx` - Fixed CRUD operations
- `src/components/ui/ErrorBoundary.tsx` - Added error handling
- `src/pages/Admin.tsx` - Updated column definitions for image uploads

### Database Operations
- All operations now use proper error handling
- Delete operations include confirmation
- Create/Update operations reload data for consistency
- Image URLs are stored in respective `image_url` or `media_url` columns

### File Upload Flow
1. Client selects image file
2. File uploaded to Supabase Storage `media` bucket
3. Public URL generated and returned
4. URL saved to database via normal CRUD operation
5. Public site displays image using stored URL

## QA Screenshots Required
Please provide screenshots of:
1. Admin delete operation with success toast
2. Admin edit form populated with data (not blank)
3. Image upload process with preview
4. Public site reflecting admin changes
5. Mobile-responsive admin interface