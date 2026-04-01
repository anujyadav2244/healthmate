# ---------- Stage 1: Build the application ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy only pom.xml for dependency caching
COPY pom.xml ./
RUN mvn -B dependency:go-offline

# Copy source
COPY src ./src

# Build application (skip tests for faster build)
RUN mvn -B clean package -DskipTests

# ---------- Stage 2: Create the runtime image ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

# Add non-root user
RUN addgroup --system spring && adduser --system --ingroup spring springuser

WORKDIR /app

# Install certificates and healthcheck tool
RUN apk add --no-cache ca-certificates wget

# Copy jar from builder
COPY --chown=springuser:springuser --from=builder /app/target/*.jar app.jar

USER springuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=prod"]
