# 1) Frontend Angular
FROM node:24-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Backend Spring Boot, com o frontend embutido em /static
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml ./
RUN mvn -B -q dependency:go-offline
COPY src ./src
COPY --from=frontend /app/dist/frontend/browser ./src/main/resources/static
RUN mvn -B -q package -DskipTests

# 3) Imagem final
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
