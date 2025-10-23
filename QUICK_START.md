# ⚡ Quick Start - 3 Steps to Get Running

## Step 1: Deploy
```bash
cd /workspace/project/am-nooby
git add -A
git commit -m "Fix all issues"
git push
```

## Step 2: Create Admin Account
1. Visit: https://noobblog.netlify.app/handler/signup
2. Sign up with: bknglabs.dev@gmail.com
3. Password: KEsh09it*ilive4Ray

## Step 3: Activate Admin
```bash
curl -X POST https://noobblog.netlify.app/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"setupKey": "nooby-admin-setup-2024"}'
```

## Done! 🎉
Access admin: https://noobblog.netlify.app/admino77

---

## What's Fixed?
✅ Sign up/sign in works (no more 404s)
✅ Real-time stats on homepage
✅ Light mode only (no dark mode)
✅ Admin at secret /admino77 URL
✅ Guides management in admin panel

## Files to Review:
- <filepath>ADMIN_SETUP_GUIDE.md</filepath> - Full setup instructions
- <filepath>CHANGES_SUMMARY.md</filepath> - All changes made

