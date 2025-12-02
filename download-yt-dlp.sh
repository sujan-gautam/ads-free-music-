#!/bin/bash

# Download yt-dlp binary for Linux
echo "Downloading yt-dlp for Linux..."

# Create bin directory if it doesn't exist
mkdir -p bin

# Download latest yt-dlp for Linux
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp

# Make it executable
chmod +x bin/yt-dlp

echo "✅ yt-dlp binary downloaded and made executable"
echo "Location: bin/yt-dlp"

# Verify it works
./bin/yt-dlp --version
