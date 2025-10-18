# 🧪 Testing Evidence & Acceptance Criteria

## 📋 Overview

This document provides the testing framework and acceptance criteria for the maheen-ai-studio admin system. Complete all tests and document results before final deployment.

---

## ✅ Acceptance Test Scenarios

### Test 1: Create New Skill Entry

**Objective:** Verify that creating a new skill in admin immediately reflects on public UI

**Steps:**
1. Log in to `/admin` with admin passcode
2. Navigate to "Skills" tab
3. Click create form on right panel
4. Fill in:
   - Skill Name: `Large Language Models`
   - Category: `Generative AI`
   - Proficiency: `90`
5. Click "Create" button
6. Observe admin skills list updates immediately
7. Open public site in new tab (or refresh)
8. Navigate to Skills section
9. Verify new skill appears with correct proficiency bar

**Expected Results:**
- ✅ Toast notification: "Created successfully"
- ✅ New skill appears in admin table instantly
- ✅ Skill visible on public Skills section
- ✅ Proficiency bar shows 90%
- ✅ No console errors

**Screenshot Evidence Required:**
1. Admin panel before creation
2. Filled form ready to submit
3. Admin panel after creation showing new skill
4. Public site showing the new skill

---

### Test 2: Edit Existing Skill Entry

**Objective:** Verify editing a skill updates database and public UI, changes persist after logout

**Steps:**
1. In admin Skills tab, click "Edit" on "Python Demo" entry
2. Change name to: `Python`
3. Change proficiency to: `95`
4. Click "Update" button
5. Verify admin list shows updated values
6. Refresh public site and verify changes
7. Log out of admin
8. Log back in
9. Verify skill still shows `Python` with `95%` proficiency

**Expected Results:**
- ✅ Toast notification: "Updated successfully"
- ✅ Admin table shows new name immediately
- ✅ Public site reflects changes (may need hard refresh)
- ✅ Changes persist after logout/login
- ✅ No RLS errors in console

**Screenshot Evidence Required:**
1. Edit form with old data
2. Edit form with new data before saving
3. Admin table after update
4. Public site showing updated skill
5. After logout/login showing persistence

---

### Test 3: Delete Entry and Verify Persistence

**Objective:** Confirm deletion removes entry from database and public UI permanently

**Steps:**
1. In admin About tab, identify a demo/test entry
2. Click "Delete" button
3. Confirm deletion in dialog
4. Verify entry removed from admin list
5. Check public site - entry should not appear
6. Log out and log back in
7. Verify entry is still gone (not just hidden)
8. Check database directly via Supabase dashboard (optional)

**Expected Results:**
- ✅ Confirmation dialog appears
- ✅ Toast notification: "Deleted successfully"
- ✅ Entry removed from admin table
- ✅ Entry not visible on public site
- ✅ Deletion persists after logout
- ✅ Database record actually deleted (not soft delete)

**Screenshot Evidence Required:**
1. Before delete - entry visible in admin
2. Confirmation dialog
3. After delete - entry gone from admin
4. Public site without the entry
5. After re-login - still gone

---

### Test 4: Upload Profile Image

**Objective:** Verify image upload workflow from device to public site display

**Steps:**
1. Navigate to admin About tab
2. Click "Edit" on About entry
3. In the "Profile Image" field, click "Upload an image"
4. Select an image from device (desktop or mobile)
   - Ensure image is < 10MB and valid format (jpg/png/webp)
5. Observe upload progress
6. Preview should appear after upload
7. Click "Update" to save
8. Navigate to public site
9. Verify About section displays the uploaded image

**Expected Results:**
- ✅ File picker opens (works on mobile and desktop)
- ✅ Loading indicator during upload
- ✅ Preview thumbnail displays after upload
- ✅ Toast notification: "Upload successful"
- ✅ Public site shows new profile image
- ✅ Image loads quickly (proper optimization)
- ✅ Image URL in database starts with Supabase Storage URL

**Screenshot Evidence Required:**
1. Upload button and file picker
2. Upload in progress (loading state)
3. Preview after successful upload
4. Admin form with uploaded image
5. Public About section showing the image

**Error Test:**
- Try uploading file > 10MB → should show error toast
- Try uploading non-image file → should show error toast

---

### Test 5: Contact Form Submission

**Objective:** Verify contact form creates database record and is accessible in admin

**Steps:**
1. On public site, navigate to Contact section
2. Fill in contact form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Message: `This is a test submission for QA`
3. Complete hCaptcha (if enabled)
4. Submit form
5. Observe success message
6. Log in to admin panel
7. Navigate to "Contacts" tab
8. Verify the submission appears with `handled = false`
9. Click to mark as handled
10. Verify status updates to `handled = true`

**Expected Results:**
- ✅ Form validates required fields
- ✅ hCaptcha verification works (if configured)
- ✅ Success toast after submission
- ✅ Contact record created with correct data
- ✅ Visible in admin Contacts tab
- ✅ Can be marked as handled
- ✅ Email notification sent (if RESEND configured)

**Screenshot Evidence Required:**
1. Filled contact form before submission
2. Success message after submission
3. Admin Contacts tab showing the entry
4. Email received (if applicable)

**Rate Limiting Test:**
- Submit contact form 4 times rapidly
- 4th submission should be rejected with rate limit message

---

### Test 6: Security Scan Results

**Objective:** Verify zero RLS violations across all tables

**Steps:**
1. Run Supabase security linter:
```bash
supabase db lint
```
2. Review output for RLS warnings
3. Specifically check these tables:
   - `contacts`
   - `admin_emails`
   - `user_roles`
   - `rate_limits`
   - `about`, `skills`, `education`, `experience`
   - `projects`, `categories`, `hire_links`

**Expected Results:**
- ✅ Zero critical RLS warnings
- ✅ All tables have RLS enabled
- ✅ Proper policies for each table role
- ✅ No public tables with PII exposed
- ✅ Storage objects properly secured

**Screenshot Evidence Required:**
1. Security scan output showing zero violations
2. Supabase dashboard RLS policy list for key tables

---

### Test 7: Admin Access Control

**Objective:** Verify only authorized users can access admin functions

**Steps:**
1. **Correct Passcode Test:**
   - Navigate to `/admin`
   - Enter correct admin passcode
   - Should gain access to dashboard

2. **Incorrect Passcode Test:**
   - Log out
   - Navigate to `/admin`
   - Enter incorrect passcode
   - Should see error message and stay locked out

3. **Session Expiry Test:**
   - Access admin with correct passcode
   - Manually set `adminTokenExpiry` in localStorage to past date
   - Refresh page
   - Should be redirected to passcode entry

4. **Non-Admin User Test:**
   - Create regular user account (not in admin_emails)
   - Try to access `/admin` route
   - Should be denied access

**Expected Results:**
- ✅ Correct passcode grants access
- ✅ Incorrect passcode shows error
- ✅ Expired sessions require re-authentication
- ✅ Non-admin users cannot access admin panel
- ✅ No passcode visible in network requests or client code

**Screenshot Evidence Required:**
1. Successful admin access
2. Failed passcode attempt
3. Access denied for non-admin user

---

## 🎯 Performance Benchmarks

Test the following and record results:

| Metric | Target | Actual | Pass/Fail |
|--------|--------|--------|-----------|
| Admin dashboard load time | < 2s | ___ s | ⬜ |
| Create new entry (no image) | < 1s | ___ s | ⬜ |
| Create entry with image upload (5MB) | < 5s | ___ s | ⬜ |
| Edit entry | < 1s | ___ s | ⬜ |
| Delete entry | < 1s | ___ s | ⬜ |
| Public site refresh after change | < 2s | ___ s | ⬜ |
| Image upload (2MB) | < 3s | ___ s | ⬜ |

---

## 🐛 Bug Report Template

If any test fails, document using this template:

```
### Bug #X: [Title]

**Test Scenario:** [Which test from above]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[Attach screenshots]

**Console Errors:**
```
[Paste any errors from browser console]
```

**Severity:** Critical / High / Medium / Low

**Status:** Open / In Progress / Fixed / Closed
```

---

## 📊 Test Summary Checklist

Before marking as complete, verify all items:

### Functional Tests
- [ ] Test 1: Create new skill - PASS
- [ ] Test 2: Edit skill - PASS
- [ ] Test 3: Delete entry - PASS
- [ ] Test 4: Upload image - PASS
- [ ] Test 5: Contact submission - PASS
- [ ] Test 6: Security scan - PASS
- [ ] Test 7: Admin access control - PASS

### Cross-Browser Testing
- [ ] Chrome/Edge (Desktop) - PASS
- [ ] Firefox (Desktop) - PASS
- [ ] Safari (Desktop) - PASS
- [ ] Mobile Chrome (Android) - PASS
- [ ] Mobile Safari (iOS) - PASS

### Security Checklist
- [ ] No hardcoded secrets in client code
- [ ] All RLS policies active
- [ ] Storage properly secured
- [ ] Rate limiting works
- [ ] Admin passcode secure
- [ ] Session management proper

### Performance Checklist
- [ ] All metrics meet targets
- [ ] No memory leaks observed
- [ ] Images optimized
- [ ] Lazy loading works
- [ ] No excessive re-renders

---

## 🎬 Final Delivery Checklist

- [ ] All tests documented and passing
- [ ] Screenshots collected for each test scenario
- [ ] Performance benchmarks recorded
- [ ] Zero critical bugs remaining
- [ ] Security scan passed
- [ ] Migration SQL file provided
- [ ] Documentation complete (README, guides)
- [ ] Staging preview URL provided
- [ ] Code pushed to repository
- [ ] Pull request created for review

---

## 📝 Test Execution Log

**Tester Name:** ___________________  
**Date:** ___________________  
**Environment:** Production / Staging / Local  
**Browser/Device:** ___________________  

**Overall Result:** ⬜ PASS  ⬜ FAIL (with issues documented)

**Notes:**
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

**Signed Off By:** ___________________  **Date:** ___________________

---

**Project:** maheen-ai-studio  
**Version:** 1.0  
**Last Updated:** 2025-01-18
