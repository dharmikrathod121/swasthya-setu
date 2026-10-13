#!/usr/bin/env bash
#
# Build verification script for Swasthya Setu.
#
# Runs the three checks that gate a successful build:
#   1. `npm run build`     - full Next.js production build
#   2. `npx tsc --noEmit`  - TypeScript type-check
#   3. `npm run lint`      - ESLint
#
# Each check prints PASS or FAIL and exits non-zero if any check fails.

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

fail() {
  echo -e "${RED}FAIL${NC}"
}

pass() {
  echo -e "${GREEN}PASS${NC}"
}

overall=0

echo "==> Running build verification checks..."

# 1. Next.js production build
echo -n "[1/3] npm run build ... "
if npm run build > /tmp/swasthya-setu-build.log 2>&1; then
  pass
else
  fail
  overall=1
  echo "      See /tmp/swasthya-setu-build.log for details."
fi

# 2. TypeScript type-check
echo -n "[2/3] npx tsc --noEmit ... "
if npx tsc --noEmit > /tmp/swasthya-setu-tsc.log 2>&1; then
  pass
else
  fail
  overall=1
  echo "      See /tmp/swasthya-setu-tsc.log for details."
fi

# 3. ESLint
echo -n "[3/3] npm run lint ... "
if npm run lint > /tmp/swasthya-setu-lint.log 2>&1; then
  pass
else
  fail
  overall=1
  echo "      See /tmp/swasthya-setu-lint.log for details."
fi

echo
if [ "$overall" -eq 0 ]; then
  echo -e "${GREEN}All checks passed.${NC}"
else
  echo -e "${RED}One or more checks failed.${NC}"
fi

exit "$overall"