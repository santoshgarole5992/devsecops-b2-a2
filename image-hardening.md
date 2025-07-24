# Docker Image Hardening: Technical Report

## What is a Container Image, and How Does it Differ from a Container?
A **container image** is a static, immutable file that includes everything needed to run an application: code, runtime, libraries, environment variables, and configuration files. It serves as a blueprint for creating containers.

A **container** is a running instance of a container image. While the image is static and read-only, the container is dynamic, with its own process, state, and network connections. Multiple containers can be instantiated from the same image, each running in isolation.

**Key Differences:**
- **Image:** Blueprint, static, reusable, read-only.
- **Container:** Running process, dynamic, isolated, can have state.

---

## What is Image Hardening?
**Image hardening** is the process of securing a container image by reducing its attack surface and eliminating unnecessary components. The goal is to minimize vulnerabilities, prevent privilege escalation, and ensure the image only contains what is strictly required to run the application.

**Key Hardening Practices:**
- Use minimal base images (e.g., Alpine, distroless, slim variants)
- Remove unnecessary packages, tools, and files
- Run as a non-root user
- Regularly update base images and dependencies
- Avoid hardcoding secrets or credentials
- Use multi-stage builds to separate build and runtime environments
- Add a `.dockerignore` file to exclude sensitive/unneeded files
- Scan images for vulnerabilities (e.g., Trivy, Snyk)

---

## Hardened Docker Image: Best Practices & Example

### Example: Hardened Node.js Dockerfile
Below is a working example based on the current repository's Dockerfile, with hardening best practices applied:

```dockerfile
FROM node:19.4.0-bullseye-slim

# Set a non-root user for running the app
RUN useradd -m appuser

# Set environment variables
ENV STAGE="DOCKER"

# Install only required packages, clean up cache
RUN apt-get update \
    && apt-get install -y --no-install-recommends netcat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app directory and set permissions
RUN mkdir /app && chown appuser:appuser /app
WORKDIR /app

# Copy package files and install dependencies as non-root
COPY --chown=appuser:appuser package.json /app/
USER appuser
RUN npm install --omit=dev

# Copy application code
COPY --chown=appuser:appuser . /app

EXPOSE 3000
CMD [ "npm", "start" ]
```

**.dockerignore** (recommended):
```
node_modules
npm-debug.log
.git
Dockerfile
.dockerignore
README.md
```

---

## Hardening Steps Taken & Security Impact

### Steps Taken
1. **Minimal Base Image:** Used `node:19.4.0-bullseye-slim` to reduce unnecessary packages.
2. **Non-root User:** Created and switched to `appuser` to avoid running as root.
3. **Remove Unnecessary Packages:** Installed only `netcat` (if required), removed package manager cache.
4. **Multi-stage Build (if applicable):** For production, use multi-stage builds to separate build and runtime dependencies.
5. **.dockerignore:** Excluded unnecessary files from the image build context.
6. **No Secrets in Image:** No hardcoded secrets or credentials in Dockerfile or code.
7. **Vulnerability Scanning:** Scan the image with tools like Trivy or Snyk as part of CI/CD.

### Security Impact
- **Reduced Attack Surface:** Fewer packages and running as non-root limit potential exploits.
- **Lower Vulnerability Count:** Smaller images with fewer dependencies have fewer CVEs.
- **Improved Compliance:** Aligns with security best practices and organizational requirements.
- **Faster Deployments:** Smaller images deploy and start faster.

---

## Working Example: Build & Run

```sh
# Build the hardened image
$ docker build -t hardened-node-app:latest .

# Run the container (should not run as root)
$ docker run --rm hardened-node-app:latest id
# Output: uid=1000(appuser) gid=1000(appuser) groups=1000(appuser)

# Start the app
$ docker run --rm -p 3000:3000 hardened-node-app:latest
```

---

## Limitations & Challenges
- **Upstream Vulnerabilities:** Some vulnerabilities may remain in the base image if no fix is available upstream.
- **Dependency Compatibility:** Upgrading to minimal or distroless images may require code changes or additional testing.
- **Debugging:** Minimal images lack debugging tools (e.g., shell, curl), making troubleshooting harder.
- **Build Complexity:** Multi-stage and distroless builds can complicate Dockerfile maintenance.
- **Performance:** Alpine uses musl libc, which may cause compatibility/performance issues for some Node.js modules.

---

## Comparative Analysis: Alpine vs. Ubuntu (Minimal Base Images)

| Feature         | Alpine                | Ubuntu (slim)         |
|-----------------|----------------------|-----------------------|
| Size            | ~5MB                  | ~30-60MB              |
| libc            | musl                  | glibc                 |
| CVE Count       | Very low              | Moderate              |
| Compatibility   | May break some libs   | High compatibility    |
| Package Manager | apk                   | apt                   |
| Debug Tools     | Minimal               | More available        |
| Use Case        | Smallest, statically  | Broader, more         |
|                 | linked apps           | compatibility         |

**Distroless** images are even smaller and more secure, but require statically linked binaries and are less flexible.

---

## Conclusion
Image hardening is essential for securing containerized applications. By following best practices—using minimal base images, removing unnecessary components, running as non-root, and scanning for vulnerabilities—you can significantly reduce risk. However, hardening is a balance between security, usability, and maintainability. Regular updates and continuous monitoring are key to maintaining a secure container environment. 