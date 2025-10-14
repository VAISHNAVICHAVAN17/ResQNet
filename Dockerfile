FROM openjdk:17-jdk-slim

WORKDIR /app

# Install Tesseract and any required tools
RUN apt-get update && apt-get install -y tesseract-ocr

COPY target/disaster-relief-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8088

CMD ["java", "-jar", "app.jar"]
