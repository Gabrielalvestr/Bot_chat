package com.example.SafeProof.services;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.Base64;
import java.io.ByteArrayInputStream;
import java.util.UUID;

@Service
public class BucketService {

        private final S3Client s3;
        private final String bucket;

        public BucketService(
                @Value("${r2.accountId}") String accountId,
                @Value("${r2.accessKey}") String accessKey,
                @Value("${r2.secretKey}") String secretKey,
                @Value("${r2.bucket}") String bucket
        ) {
            this.bucket = bucket;

            AwsBasicCredentials creds = AwsBasicCredentials.create(accessKey, secretKey);

            this.s3 = S3Client.builder()
                    .endpointOverride(URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                    .credentialsProvider(StaticCredentialsProvider.create(creds))
                    .region(Region.US_EAST_1) // qualquer região, R2 ignora
                    .build();
        }

        public String uploadBase64(String base64) {

            String key = "images/" + UUID.randomUUID() + ".png";
            // remover prefixo "data:image/png;base64,"
            if(base64.contains(",")) {
                base64 = base64.split(",")[1];
            }

            byte[] data = Base64.getDecoder().decode(base64);

            PutObjectRequest req = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType("image/png") // ajuste se necessário
                    .build();

            s3.putObject(req, software.amazon.awssdk.core.sync.RequestBody.fromBytes(data));

            // URL pública (se o bucket permitir)
            return "https://" + bucket + "." + "r2.cloudflarestorage.com/" + key;
        }

}
