#!/bin/bash

# Function to run tsc, lint, and git checks concurrently
run_checks() {
  local dir=$1
  local log_file=$2
  local dirStr=$(printf "%-20s" $dir)

  (
  cd "$dir"

    # Run tsc concurrently
    (
    npm run tsc > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "$dirStr: ✅ tsc" >> "$log_file"
    else
      echo "$dirStr: ❌ tsc" >> "$log_file"
    fi
    ) &

    # Run lint concurrently
    (
    npm run lint > /dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo "$dirStr: ✅ lint" >> "$log_file"
    else
      echo "$dirStr: ❌ lint" >> "$log_file"
    fi
    ) &

    # Run git checks concurrently
    (
    git fetch --all > /dev/null 2>&1
    branch=$(git rev-parse --abbrev-ref HEAD)
    local_commit=$(git rev-parse $branch)
    remote_commit=$(git ls-remote origin -h refs/heads/$branch | awk '{print $1}')
    if [ -n "$(git status --porcelain)" ]; then
      echo "$dirStr: ⚠️ git $branch changed" >> "$log_file"
    elif [ "$local_commit" == "$remote_commit" ]; then
      echo "$dirStr: ✅ git $branch" >> "$log_file"
    else
      echo "$dirStr: ⚠️ git $branch not synced with origin" >> "$log_file"
    fi
    ) &

    # Wait for all background processes to complete
    wait
    ) &
  }

# Create a temporary directory for log files
TEMP_DIR=$(mktemp -d)
CORE_LOG="$TEMP_DIR/core_log.txt"
API_LOG="$TEMP_DIR/api_log.txt"
WEB_LOG="$TEMP_DIR/web_log.txt"

# Run checks concurrently for all services
run_checks "../core" "$CORE_LOG"
run_checks "../api" "$API_LOG"
run_checks "../web" "$WEB_LOG"

echo "Waiting for checks to complete... "
wait

# Display the logs
SECTION="=========================================="
echo $SECTION
cat "$CORE_LOG"
echo $SECTION
cat "$API_LOG"
echo $SECTION
cat "$WEB_LOG"
echo $SECTION
echo "Completed checks"

# Clean up temporary directory
rm -r "$TEMP_DIR"
