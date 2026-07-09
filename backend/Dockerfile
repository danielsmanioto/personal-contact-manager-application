# Multi-stage build for Spring Boot application

# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar application.jar

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "application.jar"]
