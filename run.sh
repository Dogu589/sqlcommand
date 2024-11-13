#!/bin/bash

# Function to check if a port is in use
is_port_in_use() {
  if lsof -i :$1 >/dev/null; then
    return 0  # port is in use
  else
    return 1  # port is available
  fi
}

# List of default ports to check
PORTS=(8082 8083 8084 8085)
SELECTED_PORT=""

# Find the first available port from the default list
for PORT in "${PORTS[@]}"; do
  if ! is_port_in_use "$PORT"; then
    SELECTED_PORT=$PORT
    break
  fi
done

# If no default port found in the list, prompt the user to specify another port
if [ -z "$SELECTED_PORT" ]; then
  echo "None of the default ports (8082-8085) are available."
  while true; do
    read -p "Please specify a port that is available: " user_port
    if ! [[ "$user_port" =~ ^[0-9]+$ ]]; then
      echo "Invalid input. Please enter a numeric port."
    elif is_port_in_use "$user_port"; then
      echo "Port $user_port is already in use. Please choose another."
    else
      SELECTED_PORT=$user_port
      break
    fi
  done
else
  echo "Port $SELECTED_PORT is available."
fi

# Start HTTP server on the selected port
echo "Starting HTTP server on port $SELECTED_PORT..."
python3 -m http.server "$SELECTED_PORT" &

# Open Firefox with the chosen port
firefox "http://localhost:$SELECTED_PORT" &
