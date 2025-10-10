# Website Management System

## Overview

The AI Web Site plugin provides a comprehensive website management system where users can create, edit, and manage multiple websites through a WordPress-based interface.

## Key Concepts

### Website Storage
- **Database Table**: `wp_ai_web_site_websites`
- **User Association**: Each website is linked to a WordPress user via `user_id`
- **Configuration**: Website data is stored as JSON in the `config` column
- **Status**: Websites can have different statuses (draft, active, etc.)

### Subdomain Management
- **Optional Subdomains**: Subdomains are NOT required for website creation
- **Later Assignment**: Users can add subdomains later through the management interface
- **Flexible Structure**: Websites can exist without subdomains and be accessed via direct links

## Database Schema

```sql
CREATE TABLE wp_ai_web_site_websites (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    user_id bigint(20) NOT NULL,
    subdomain varchar(255) NOT NULL,  -- Can be empty initially
    domain varchar(255) NOT NULL,     -- Base domain (e.g., ai-web.site)
    config longtext NOT NULL,         -- JSON configuration
    status varchar(50) DEFAULT 'draft',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_user_subdomain (user_id, subdomain, domain),
    KEY user_id (user_id),
    KEY subdomain (subdomain),
    KEY domain (domain),
    KEY status (status)
);
```

## User Interface

### Website List
- **Shortcode**: `[ai_user_sites]`
- **Display**: Shows ALL websites belonging to the current user
- **Subdomain Status**: 
  - If empty: Shows "No subdomain assigned" with input field to add one
  - If set: Shows full URL (subdomain.domain.com) with "View Site" button

### Website Actions
1. **Edit Website**: Direct link to editor with `?site_id=X` parameter
2. **Add Subdomain**: Input field for assigning subdomains to existing websites
3. **Delete Site**: Remove website from user's account
4. **View Site**: Access live website (only if subdomain is assigned)

## API Endpoints

### Save Website Configuration
- **Endpoint**: `POST /wp-json/ai-web-site/v1/website-config`
- **Authentication**: WordPress nonce or local API key
- **Payload**: JSON configuration data
- **Response**: Success status and website ID

### Get Website Configuration
- **Endpoint**: `GET /wp-json/ai-web-site/v1/website-config/{domain}`
- **Authentication**: WordPress nonce
- **Response**: Website configuration JSON

### Add Subdomain
- **Endpoint**: `POST /wp-json/ai-web-site/v1/add-subdomain`
- **Authentication**: WordPress nonce
- **Payload**: `website_id` and `subdomain_name`
- **Response**: Success status

## Workflow

### 1. Website Creation
1. User creates website in editor
2. Configuration is saved with `user_id`, `domain`, and `config`
3. `subdomain` field is initially empty or set to default value
4. Website appears in user's list as "No subdomain assigned"

### 2. Subdomain Assignment
1. User accesses website management page
2. Clicks "Add Subdomain" for desired website
3. Enters subdomain name (e.g., "my-site")
4. System validates subdomain availability
5. Database is updated with subdomain value
6. Website URL becomes accessible (e.g., "my-site.ai-web.site")

### 3. Website Access
- **With Subdomain**: `https://subdomain.domain.com`
- **Without Subdomain**: Direct editor link with `site_id` parameter
- **Editor Access**: `https://editor.domain.com/?site_id=X`

## Security Considerations

### User Isolation
- Users can only see their own websites
- Website access is restricted by `user_id`
- Subdomain uniqueness is enforced per domain

### Authentication
- WordPress nonce verification for API calls
- User login requirement for management interface
- Subscription validation for premium features

## Development Notes

### Database Queries
```php
// Get all user websites (including those without subdomains)
$websites = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$table_name} WHERE user_id = %d ORDER BY created_at DESC",
    $user_id
));

// Check subdomain availability
$existing = $wpdb->get_row($wpdb->prepare(
    "SELECT id FROM {$table_name} WHERE subdomain = %s AND domain = %s",
    $subdomain, $domain
));
```

### Frontend Integration
```javascript
// Save website configuration
const response = await fetch('/wp-json/ai-web-site/v1/website-config', {
    method: 'POST',
    credentials: 'include', // Include WordPress cookies
    headers: {
        'X-WP-Nonce': nonce,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(configData)
});
```

## Troubleshooting

### Website Not Appearing in List
1. Check `user_id` matches current user
2. Verify database table name is correct
3. Ensure no status filters are applied
4. Check for JavaScript errors in browser console

### Subdomain Not Saving
1. Verify subdomain format (alphanumeric + hyphens only)
2. Check for uniqueness conflicts
3. Ensure proper database permissions
4. Validate WordPress nonce

### Configuration Not Loading
1. Check domain parameter in API call
2. Verify JSON configuration is valid
3. Ensure proper CORS headers
4. Check WordPress authentication state

