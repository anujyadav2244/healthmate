# ---------- Stage 1: Build the application ----------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copy backend build files for dependency caching
COPY server/pom.xml ./pom.xml
RUN mvn -B dependency:go-offline

# Copy backend source and package
COPY server/src ./src
RUN mvn -B clean package -DskipTests

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN addgroup --system spring && adduser --system --ingroup spring springuser
RUN apk add --no-cache ca-certificates wget

WORKDIR /app

COPY --chown=springuser:springuser --from=builder /app/target/*.jar app.jar

USER springuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8080/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
CMD ["--spring.profiles.active=prod"]
