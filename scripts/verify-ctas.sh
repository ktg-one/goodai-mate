#!/bin/bash
# Verify all form CTAs use SURVEY_URL and call CTAs use PHONE_HREF

echo "=== Verifying centralized link usage ==="
echo ""

# Count occurrences of SURVEY_URL import/usage
echo "SURVEY_URL usage:"
grep -r "SURVEY_URL" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v node_modules | grep -v ".next" | wc -l
echo "files use SURVEY_URL"

# Count occurrences of PHONE_HREF import/usage  
echo ""
echo "PHONE_HREF usage:"
grep -r "PHONE_HREF" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v node_modules | grep -v ".next" | wc -l
echo "files use PHONE_HREF"

# Check for hardcoded Google Form URLs
echo ""
echo "Checking for hardcoded Google Form URLs (should only be in lib/links.ts):"
grep -r "docs.google.com/forms" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v node_modules | grep -v ".next" | grep -v "lib/links.ts" | grep -v "scripts/" | grep -v ".test.ts"
if [ $? -eq 0 ]; then
    echo "WARNING: Found hardcoded form URLs outside lib/links.ts"
    exit 1
else
    echo "✓ No hardcoded form URLs found outside lib/links.ts"
fi

# Check for hardcoded tel: links
echo ""
echo "Checking for hardcoded tel: links (should only be in lib/links.ts):"
grep -r "tel:" --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" . | grep -v node_modules | grep -v ".next" | grep -v "lib/links.ts" | grep -v "scripts/"
if [ $? -eq 0 ]; then
    echo "WARNING: Found hardcoded tel: links outside lib/links.ts"
    exit 1
else
    echo "✓ No hardcoded tel: links found outside lib/links.ts"
fi

echo ""
echo "=== All CTAs use centralized constants ==="
