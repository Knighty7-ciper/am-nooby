# Admin Guide

## Overview

The NoobBlog Admin Dashboard provides powerful tools to manage your blogging platform.

**Access**: Your admin dashboard URL will be provided after deployment (e.g., `https://your-admin-site.netlify.app`)

## Getting Started

### First Login

1. Navigate to the admin dashboard
2. Sign in with your admin credentials:
   - Email: `admin@noobblog.com` (from seed data)
   - Set password through Stack Auth

### Dashboard Overview

The dashboard shows:
- **Total Users**: Registered users
- **Total Posts**: All posts (published + drafts)
- **Published Posts**: Live content
- **Monthly Views**: Traffic metrics
- **Recent Activity**: Latest platform events
- **Top Posts**: Best performing content

## Managing Content

### Posts Management

**Location**: Dashboard → Posts

#### View All Posts

- See all posts with status indicators
- Filter by status (Published, Draft, Scheduled)
- Search by title or author
- Sort by date, views, likes

#### Edit Posts

1. Click on any post
2. Make your changes
3. Save or Publish

#### Bulk Actions

- Select multiple posts
- Bulk publish/unpublish
- Bulk delete
- Bulk change category

### Categories Management

**Location**: Dashboard → Categories

#### Create Category

1. Click "New Category"
2. Fill in:
   - Name
   - Slug (auto-generated)
   - Description
   - Icon emoji
   - Color
3. Save

#### Edit Category

- Click on category name
- Update fields
- Save changes

#### Delete Category

⚠️ **Warning**: Deleting a category will unlink it from posts (posts won't be deleted)

### Tags Management

**Location**: Dashboard → Tags

#### Features

- View all tags with post counts
- Merge similar tags
- Rename tags
- Delete unused tags

## User Management

**Location**: Dashboard → Users

### User Roles

#### Admin
- Full system access
- Manage all content
- Manage users
- Access settings

#### Editor
- Review and publish posts
- Edit all posts
- Manage categories/tags

#### Author
- Create and edit own posts
- Cannot publish without approval

#### Reader
- Read content
- Comment and interact
- No content creation

### Managing Users

#### Change User Role

1. Go to Users section
2. Find user
3. Click "Edit"
4. Select new role
5. Save

#### Suspend User

1. Find user
2. Click "Actions" → "Suspend"
3. User cannot log in
4. Content remains visible

#### Ban User

1. Find user
2. Click "Actions" → "Ban"
3. User permanently blocked
4. Optionally hide their content

## Comments Moderation

**Location**: Dashboard → Comments

### Review Comments

- View all comments
- Filter by post, user, status
- Search content

### Moderation Actions

#### Approve Comment
- Automatically approved by default
- Manual approval if moderation enabled

#### Delete Comment
- Permanently remove
- Optionally notify user

#### Report Spam
- Mark as spam
- Train spam filter

## Analytics

**Location**: Dashboard → Analytics

### Metrics Available

#### Traffic
- Page views
- Unique visitors
- Bounce rate
- Session duration

#### Content Performance
- Most viewed posts
- Most liked posts
- Most commented posts
- Trending topics

#### User Engagement
- New signups
- Active users
- Comment activity
- Like/share activity

#### Newsletter
- Subscriber count
- Growth rate
- Open rates
- Click rates

### Exporting Data

1. Select date range
2. Choose metrics
3. Click "Export"
4. Download CSV or PDF

## Newsletter Management

**Location**: Dashboard → Newsletter

### Subscriber Management

- View all subscribers
- Filter by status (Active, Unsubscribed)
- Export subscriber list
- Import subscribers

### Send Newsletter

1. Click "Compose Newsletter"
2. Write content
3. Preview
4. Select recipients:
   - All subscribers
   - Specific segment
5. Schedule or send immediately

### Email Templates

- Welcome email
- Weekly digest
- New post notification
- Custom templates

## Settings

**Location**: Dashboard → Settings

### General Settings

- Site name
- Site description
- Logo
- Favicon
- Timezone
- Language

### Appearance

- Theme colors
- Typography
- Layout options
- Custom CSS

### Email Settings

- SMTP configuration
- Email templates
- Sender information

### SEO Settings

- Default meta title
- Default meta description
- Social media images
- Structured data

### Security

- Two-factor authentication
- Password policies
- Session timeout
- IP whitelist

### Integrations

- Google Analytics
- Google Search Console
- Social media accounts
- Third-party services

## Best Practices

### Content Moderation

1. **Review regularly**: Check new posts and comments daily
2. **Set guidelines**: Create clear content policies
3. **Be consistent**: Apply rules fairly
4. **Communicate**: Inform users of policy violations

### User Management

1. **Role assignment**: Give users appropriate permissions
2. **Monitor activity**: Watch for suspicious behavior
3. **Respond quickly**: Address user issues promptly
4. **Encourage quality**: Reward good contributors

### Analytics

1. **Track trends**: Monitor metrics over time
2. **Set goals**: Define success metrics
3. **Test changes**: A/B test new features
4. **Act on data**: Make informed decisions

## Troubleshooting

### Cannot Access Dashboard

**Issue**: 403 Forbidden
**Solution**: Verify you have admin role

### Changes Not Saving

**Issue**: Data not persisting
**Solution**: Check browser console for errors

### Slow Performance

**Issue**: Dashboard loads slowly
**Solution**: 
- Clear browser cache
- Check internet connection
- Report to technical support

## Security Tips

1. **Strong passwords**: Use unique, complex passwords
2. **Enable 2FA**: Add extra security layer
3. **Regular backups**: Backup data frequently
4. **Monitor access**: Review login activity
5. **Update regularly**: Keep system updated

## Support

Need help?
- Email: admin@noobblog.com
- Documentation: /docs
- Community: /community
- GitHub Issues: /issues
