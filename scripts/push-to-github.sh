#!/bin/bash
# Himalayan Freak - GitHub Push Script
# Pushes the project to: https://github.com/ayanalidar/himalayan-freak
#
# Usage:
#   1. Create an empty repository at https://github.com/new
#      - Owner: ayanalidar
#      - Name: himalayan-freak (or any name you prefer)
#      - Do NOT add README/license (keep it empty)
#   2. Generate a Personal Access Token:
#      GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
#      → Generate new token → scope: "repo" (full control of private repositories)
#   3. Run this script:
#      bash scripts/push-to-github.sh <TOKEN>
#
# Example:
#   bash scripts/push-to-github.sh ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

set -e

TOKEN="${1:-}"
REPO_NAME="${2:-himalayan-freak}"
GITHUB_USER="ayanalidar"

if [ -z "$TOKEN" ]; then
  echo "=========================================="
  echo "Himalayan Freak - GitHub Push"
  echo "=========================================="
  echo ""
  echo "Usage: bash scripts/push-to-github.sh <github-token> [repo-name]"
  echo ""
  echo "Default repo: https://github.com/$GITHUB_USER/$REPO_NAME"
  echo ""
  echo "Get a token from:"
  echo "  GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)"
  echo "  → Generate new token → scope: 'repo'"
  echo ""
  echo "Example:"
  echo "  bash scripts/push-to-github.sh ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  echo "  bash scripts/push-to-github.sh ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx my-custom-repo"
  exit 1
fi

REPO_URL="https://${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

cd /home/z/my-project

echo "=========================================="
echo "Himalayan Freak - Pushing to GitHub"
echo "=========================================="
echo ""
echo "Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
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
- No animated scroll indicator on hero

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
git push -u origin main || {
  echo ""
  echo "Push failed. Common fixes:"
  echo "  1. Make sure the repo exists at https://github.com/$GITHUB_USER/$REPO_NAME"
  echo "  2. Verify your token has 'repo' scope"
  echo "  3. If repo has existing content, run: git pull --rebase origin main"
  exit 1
}

echo ""
echo "=========================================="
echo "Success! Your project is live on GitHub."
echo "=========================================="
echo ""
echo "Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "  1. Add collaborators in repo settings"
echo "  2. Set up environment secrets for production (Amadeus, RailwayAPI, NextAuth)"
echo "  3. Deploy to Vercel / Netlify / your own hosting"
echo ""
