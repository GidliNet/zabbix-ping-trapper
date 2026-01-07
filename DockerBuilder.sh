#!/usr/bin/env bash
set -e

# --------------------------
# Parameters
# --------------------------
DOCKER_USER="$1"      # Docker Hub username
IMAGE_NAME="$2"       # Image name
BUILD_DIR="$3"        # Directory with Dockerfile
IMAGE_TAG="$4"        # Tag (e.g., v1.0.0)
# --------------------------

# --------------------------
# Validation
# --------------------------
if [[ -z "$DOCKER_USER" || -z "$IMAGE_NAME" || -z "$BUILD_DIR" || -z "$IMAGE_TAG" ]]; then
  echo "Usage: $0 <docker_user> <image_name> <build_dir> <tag>"
  echo "Example: $0 jude315 zabbix-ping-trapper ./zabbix-ping-trapper v1.0.0"
  exit 1
fi

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "❌ Build directory does not exist: $BUILD_DIR"
  exit 1
fi

# --------------------------
# Check if Docker needs sudo
# --------------------------
DOCKER_CMD="docker"
if ! docker info >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    DOCKER_CMD="sudo docker"
    echo "⚠️  Docker requires sudo — using sudo"
  else
    echo "❌ Docker not accessible and sudo not found"
    exit 1
  fi
fi

# --------------------------
# Check if buildx is available
# --------------------------
if ! $DOCKER_CMD buildx version >/dev/null 2>&1; then
  echo "❌ Docker Buildx is required for multi-arch builds"
  exit 1
fi

# --------------------------
# Image tags
# --------------------------
AMD64_IMAGE="$DOCKER_USER/$IMAGE_NAME:amd64-$IMAGE_TAG"
ARM64_IMAGE="$DOCKER_USER/$IMAGE_NAME:arm64-$IMAGE_TAG"
MANIFEST_IMAGE="$DOCKER_USER/$IMAGE_NAME:$IMAGE_TAG"

echo "================================================="
echo "🚀 Multi-Arch Docker Build → Tag → Push → Manifest"
echo "Build dir      : $BUILD_DIR"
echo "AMD64 tag      : $AMD64_IMAGE"
echo "ARM64 tag      : $ARM64_IMAGE"
echo "Manifest tag   : $MANIFEST_IMAGE"
echo "Docker cmd     : $DOCKER_CMD"
echo "================================================="
echo

# --------------------------
# Step 0: Update
# --------------------------
echo "Step 0: Updating git repository..."
cd "$BUILD_DIR"
git pull
cd ..
echo "✅ Git updated"
echo

# --------------------------
# Step 1: Build & Push amd64
# --------------------------
echo "🛠 Step 1: Building amd64 image..."
$DOCKER_CMD buildx build --platform linux/amd64 -t "$AMD64_IMAGE" --push "$BUILD_DIR"
echo "✅ amd64 image built & pushed: $AMD64_IMAGE"
echo

# --------------------------
# Step 2: Build & Push arm64
# --------------------------
echo "🛠 Step 2: Building arm64 image..."
$DOCKER_CMD buildx build --platform linux/arm64 -t "$ARM64_IMAGE" --push "$BUILD_DIR"
echo "✅ arm64 image built & pushed: $ARM64_IMAGE"
echo

# --------------------------
# Step 3: Create and push multi-arch manifest
# --------------------------
echo "📦 Step 3: Creating and pushing manifest list..."
$DOCKER_CMD manifest create "$MANIFEST_IMAGE" "$AMD64_IMAGE" "$ARM64_IMAGE"
$DOCKER_CMD manifest push "$MANIFEST_IMAGE"
echo "✅ Manifest created & pushed: $MANIFEST_IMAGE"
echo

echo "================================================="
echo "🎉 Multi-arch images & manifest pushed successfully!"
echo "================================================="
