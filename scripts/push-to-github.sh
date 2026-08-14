#!/bin/bash
# Himalayan Freak - GitHub Push Script
# Run this script to push the project to your GitHub repository.
#
# Usage:
#   1. Create a new (empty) repository on GitHub.com (don't add README/license)
#   2. Copy the HTTPS clone URL (e.g. https://github.com/your-username/himalayan-freak.git)
#   3. Run: bash scripts/push-to-github.sh https://github.com/your-username/himalayan-freak.git
#
# Or with a GitHub Personal Access Token (recommended for private repos):
#   bash scripts/push-to-github.sh https://<TOKEN>@github.com/your-username/himalayan-freak.git
#
# To get a token:
#   GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
#   Scopes needed: repo (full control of private repositories)

set -e

REPO_URL="${1:-}"
if [ -z "$REPO_URL" ]; then
  echo "Usage: bash scripts/push-to-github.sh <github-repo-url>"
  echo ""
  echo "Examples:"
  echo "  bash scripts/push-to-github.sh https://github.com/your-username/himalayan-freak.git"
  echo "  bash scripts/push-to-github.sh https://<TOKEN>@github.com/your-username/himalayan-freak.git"
  exit 1
fi

cd /home/z/my-project

echo "=========================================="
echo "Himalayan Freak - Pushing to GitHub"
echo "=========================================="
echo ""
echo "Repository: $REPO_URL"
echo ""

# Check git is initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git branch -M main
fi

# Configure user if not set
if [ -z "$(git config user.name)" ]; then
  git config user.name "GuardianX"
fi
if [ -z "$(git config user.email)" ]; then
  git config user.email "guardianx@himalayanfreak.com"
fi

# Add remote (or update if exists)
if git remote get-url origin > /dev/null 2>&1; then
  echo "Updating existing origin remote..."
  git remote set-url origin "$REPO_URL"
else
  echo "Adding origin remote..."
  git remote add origin "$REPO_URL"
fi

# Stage all changes
echo ""
echo "Staging changes..."
git add -A

# Show what will be committed
echo ""
echo "Files to be committed:"
git status --short | head -30

# Commit if there are changes
if ! git diff --cached --quiet; then
  echo ""
  echo "Committing changes..."
  git commit -m "Himalayan Freak - Full travel platform with AI agent, CRM, PDF export

Features:
- Home, Company, Destinations (18 with detail pages), Packages (6 customisable)
- Trip Planner (7-step wizard with live cost estimate)
- Flights & Trains (real airline & train data, Amadeus/IRCTC integration ready)
- Group Booking Portal (5-step wizard for 10+ travellers with roster)
- CRM Dashboard (Kanban leads, customers, bookings, tasks, vendors, communications)
- User Dashboard (bookings, saved trips, wishlist, documents, reviews, profile)
- Admin Destination & Package editor (full CRUD)
- AI Travel Agent chatbot (planning, recommendations, booking creation)
- Itinerary PDF export (branded multi-page PDF)
- Authentication (NextAuth.js - admin & user roles)
- Dark mode, responsive design, Himalayan branding

Tech Stack:
- Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui
- Prisma + SQLite
- NextAuth.js + bcrypt
- pdf-lib for PDF generation
- z-ai-web-dev-sdk for AI chat
- Framer Motion, Recharts, Zustand

Made & maintained by GuardianX"
else
  echo ""
  echo "No new changes to commit."
fi

# Push
echo ""
echo "Pushing to GitHub..."
echo "(You may be prompted for credentials if not using a token URL)"
git push -u origin main || {
  echo ""
  echo "Push failed. Common fixes:"
  echo "  1. If using HTTPS: use a Personal Access Token instead of password"
  echo "  2. If repo has existing content: git pull --rebase origin main first"
  echo "  3. If permission denied: check your token has 'repo' scope"
  exit 1
}

echo ""
echo "=========================================="
echo "Success! Your project is on GitHub."
echo "=========================================="
echo ""
echo "Repository: $REPO_URL"
echo ""
echo "Next steps:"
echo "  1. Add collaborators in repo settings"
echo "  2. Set up environment secrets in repo settings (for Amadeus, RailwayAPI, NextAuth)"
echo "  3. Deploy to Vercel / Netlify / your own hosting"
echo ""
