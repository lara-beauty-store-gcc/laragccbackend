# STOP — do not deploy this file on EasyPanel for the store or API.
#
# EasyPanel services:
#   Store → Source path: frontend  → port 3000
#   API   → Source path: backend   → port 8000
#
# This Dockerfile exists only to fail fast if the repo root is used by mistake.

FROM alpine:3.19
RUN echo "" && \
    echo "ERROR: Wrong EasyPanel source path." && \
    echo "  Store: set path to 'frontend' (not repo root)" && \
    echo "  API:   set path to 'backend'" && \
    echo "" && \
    exit 1
