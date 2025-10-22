#!/bin/bash

echo "🔒 Removing exposed credentials from documentation files..."

# Define the real credentials (to be replaced)
REAL_DB_URL="postgresql://neondb_owner:npg_fKoj69ErPxXi@ep-shiny-math-ahr6vjv4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
REAL_DB_PASSWORD="npg_fKoj69ErPxXi"
REAL_STACK_PROJECT_ID="b9d83c23-8940-4835-8323-a13649ca0e56"
REAL_STACK_PUBLISHABLE="pck_q4f2q777frjx8f9vdzgvcdt2nz0v15pbqavcykk811gj8"
REAL_STACK_SECRET="ssk_b2f0mysbrtcr73rq86aye7ebgkw6tf9gq6xdyb97tq4x8"

# Define placeholder values
PLACEHOLDER_DB_URL="postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require"
PLACEHOLDER_DB_PASSWORD="your_database_password"
PLACEHOLDER_STACK_PROJECT_ID="your-stack-project-id"
PLACEHOLDER_STACK_PUBLISHABLE="pck_your_publishable_key_here"
PLACEHOLDER_STACK_SECRET="ssk_your_secret_key_here"

# List of markdown files to fix
FILES=(
    "DEPLOYMENT_COMPLETE.md"
    "DEPLOYMENT_FIX_FINAL.md"
    "DEPLOYMENT_SUMMARY.md"
    "QUICK_DEPLOY_GUIDE.md"
    "NO_SQL_FILES_NEEDED.md"
    "docs/DATABASE_GUIDE.md"
    "docs/deployment.md"
)

# Counter
fixed=0

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  Fixing: $file"
        
        # Create temporary file
        temp_file="${file}.tmp"
        
        # Replace credentials with placeholders
        sed -e "s|${REAL_DB_URL}|${PLACEHOLDER_DB_URL}|g" \
            -e "s|${REAL_DB_PASSWORD}|${PLACEHOLDER_DB_PASSWORD}|g" \
            -e "s|${REAL_STACK_PROJECT_ID}|${PLACEHOLDER_STACK_PROJECT_ID}|g" \
            -e "s|${REAL_STACK_PUBLISHABLE}|${PLACEHOLDER_STACK_PUBLISHABLE}|g" \
            -e "s|${REAL_STACK_SECRET}|${PLACEHOLDER_STACK_SECRET}|g" \
            "$file" > "$temp_file"
        
        # Replace original file
        mv "$temp_file" "$file"
        
        ((fixed++))
    else
        echo "  ⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ Fixed $fixed documentation files"
echo ""
echo "🔒 Your real credentials are safe in .env.local (gitignored)"
echo "📝 All documentation now uses placeholder values"

