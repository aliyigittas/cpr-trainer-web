package com.lpsoft.cpr_trainer_backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@SpringBootApplication
@RestController
public class CprTrainerBackendApplication {

    private final DatabaseAdapter databaseAdapter;

    //@Autowired
    public CprTrainerBackendApplication(DataSource dataSource) {
        this.databaseAdapter = new DatabaseAdapter(dataSource);
    }

    @Bean
    public DatabaseAdapter databaseAdapter(DataSource dataSource) {
        return new DatabaseAdapter(dataSource);
    }

	public static void main(String[] args) {
		SpringApplication.run(CprTrainerBackendApplication.class, args);
	}

	    // Uygulama başladığında bağlantı testi yapacak
	// @Bean
    // CommandLineRunner testConnection(DataSource dataSource) {
    //     return args -> {
    //         try (Connection connection = dataSource.getConnection()) {
    //             System.out.println("✅ Veritabanı bağlantısı başarılı!");
    //             //insert to users table
    //             String sql = """
    //                     INSERT INTO `cpr`.`users` (firstname, surname, username, email, password, khasID) VALUES (?, ?, ?, ?, ?, ?)
    //             """;
    //             try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
    //                 preparedStatement.setString(1, "John");
    //                 preparedStatement.setString(2, "Doe");
    //                 preparedStatement.setString(3, "johndoe");
    //                 preparedStatement.setString(4, "mail@mail.com");
    //                 preparedStatement.setString(5, "password");
    //                 preparedStatement.setString(6, "123456789");
    //                 preparedStatement.executeUpdate();
    //                 System.out.println("✅ Kullanıcı başarıyla eklendi!");
    //             } catch (SQLException e) {
    //                 System.err.println("❌ Kullanıcı eklenirken hata oluştu: " + e.getMessage());
    //             }
    //         } catch (Exception e) {
    //             System.err.println("❌ Veritabanı bağlantısı başarısız: " + e.getMessage());
    //         }
    //     };
    // }

    @PostMapping("/savePerformance")
    public String savePerformanceData(@RequestBody String performance) {
        try {
            System.out.println("Received user data: " + performance);
            //parse user data from class it will come as json format
            Performance performanceData = new ObjectMapper().readValue(performance, Performance.class);
            String openAiResponse = askOpenAi(performance); // Burada çağırdığın anda bekler!
            System.out.println("OpenAI Response: " + openAiResponse);

            //insert to users table
            if (databaseAdapter.savePerformance(performanceData)) {
                System.out.println("✅ Performance başarıyla eklendi!");
                if(databaseAdapter.saveDepthArray(performanceData.getDepthArray(), performanceData.getUid(),"D")){
                    System.out.println("✅ Performance depth details başarıyla eklendi!");
                    if(databaseAdapter.saveFreqArray(performanceData.getFreqArray(), performanceData.getUid(),"F")){
                        System.out.println("✅ Performance freq details başarıyla eklendi!");
                        if (databaseAdapter.savePerformanceNotes(openAiResponse, performanceData.getUid(), "A")){
                            System.out.println("✅ Performance notes başarıyla eklendi!");
                        } else {
                            System.err.println("❌ Performance notes eklenirken hata oluştu!");
                        }
                    }
                    else {
                        System.err.println("❌ Performance freq details eklenirken hata oluştu!");
                    }
                }
                else {
                    System.err.println("❌ Performance depth details eklenirken hata oluştu!");
                }
                createDump();
            } else {
                System.err.println("❌ Performance eklenirken hata oluştu!");
                return "Error adding performance!";
            }
            
            return "Performance created successfully: " + performanceData.getId() + "-" + performanceData.getFeedbackType();
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
            return "Error processing performance data!";
        }
    }

    //@PostMapping("/askOpenAi")
    public String askOpenAi(@RequestBody String data) {
        ObjectMapper objectMapper = new ObjectMapper();
        RestTemplate restTemplate = new RestTemplate();
        String apiKey = "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"; // Buraya kendi API Key'ini yaz


        String finalPrompt = """
            You are an expert CPR training performance reviewer.

            You are given a dataset from a CPR training session. Analyze the provided performance metrics carefully.

            Your task:
            - Summarize the CPR performance into exactly 4-5 key points.
            - Each point must be a JSON object with the following structure:
            {
                "message": "A short, clear and concise sentence summarizing a key insight.",
                "sentiment": "Positive" or "Negative"
            }
            - Return a JSON array containing all the key points.
            - Focus on depth quality, frequency control, consistency, and overall performance score.

            Here is the data you must analyze: "\n"
            """ + data + "\n";

        try {
            // JSON nesnesi oluştur
            ObjectNode requestJson = objectMapper.createObjectNode();
            requestJson.put("model", "gpt-4o");

            ArrayNode messagesArray = objectMapper.createArrayNode();
            ObjectNode userMessage = objectMapper.createObjectNode();
            userMessage.put("role", "user");
            userMessage.put("content", finalPrompt);
            messagesArray.add(userMessage);

            requestJson.set("messages", messagesArray);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<String> request = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestJson),
                    headers
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    "https://api.openai.com/v1/chat/completions",
                    HttpMethod.POST,
                    request,
                    String.class
            );

            String openAiResponse = response.getBody();
            // JSON yanıtını ayrıştır
            ObjectNode responseJson = objectMapper.readValue(openAiResponse, ObjectNode.class);
            String content = responseJson.get("choices").get(0).get("message").get("content").asText();

            // Eğer başında ve sonunda ``` varsa onları temizle
            content = content.replaceAll("^```json\\s*", "").replaceAll("\\s*```$", "").trim();
            return content;

        } catch (Exception e) {
            e.printStackTrace();
            return "Hata oluştu: " + e.getMessage();
        }
    }

    @GetMapping("/createDump")
    public static String createDump() {
        // --skip-ssl parametresiyle SSL devre dışı bırakılıyor
        System.out.println("Dump alınıyor...");
        String dumpCommand;
        String environment = System.getenv("DOCKER_ENV");
        if ("true".equals(environment)) {
            dumpCommand = "mariadb-dump --databases cpr -u cpr-trainer -p'cprTrainer123' -h db --skip-ssl > /app/dumps/cpr.sql";
        } else{
            dumpCommand = "mysqldump --databases cpr -u cpr-trainer -p'cprTrainer123' -h localhost > ./../db-dumps/cpr.sql";
        }
        try {
            Process process = Runtime.getRuntime().exec(new String[] {"sh", "-c", dumpCommand});
            
            // Hata ve çıktı loglarını alalım
            StringBuilder output = new StringBuilder();
            StringBuilder errorOutput = new StringBuilder();
            
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                 BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                while ((line = errorReader.readLine()) != null) {
                    errorOutput.append(line).append("\n");
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                System.out.println("Dump alma işlemi başarılı!");
                return "Dump alındı!\n" + output.toString();
            } else {
                return "Dump alma işlemi başarısız!\n" + errorOutput.toString();
            }
        } catch (IOException | InterruptedException e) {
            //e.printStackTrace();
            return "Dump alınırken hata oluştu!";
        }
    }
    
    @PostMapping("/register")
    public String registerUser(@RequestBody String user) {
        try {
            System.out.println("Received user data: " + user);
            //parse user data from class it will come as json format
            User userData = new ObjectMapper().readValue(user, User.class);

            //insert to users table
            if (databaseAdapter.registerUser(userData)) {
                System.out.println("✅ Kullanıcı başarıyla eklendi!");
                createDump();
            } else {
                System.err.println("❌ Kullanıcı eklenirken hata oluştu!");
                return "Error adding user!";
            }
            
            return "User created successfully: " + userData.getFirstname() + " " + userData.getSurname();
        } catch (JsonProcessingException ex) {
            //ex.printStackTrace();
            return "Error processing user data!";
        }
    }

    //get uid from email in getmapping
    
   @GetMapping("/getUid")
    public String getUid(@RequestParam String email) {
        try {
            System.out.println("Received email: " + email);
            //parse user data from class it will come as json format
            return String.valueOf(databaseAdapter.getUid(email));
            
        } catch (Exception ex) {
            ex.printStackTrace();
            return "Error processing user data!";
        }
    }
}