package com.lpsoft.cpr_trainer_backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.sql.DataSource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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

            //insert to users table
            if (databaseAdapter.savePerformance(performanceData)) {
                System.out.println("✅ Performance başarıyla eklendi!");
                if(databaseAdapter.saveDepthArray(performanceData.getDepthArray(), performanceData.getUid())){
                    System.out.println("✅ Performance depth details başarıyla eklendi!");
                    if(databaseAdapter.saveFreqArray(performanceData.getFreqArray(), performanceData.getUid())){
                        System.out.println("✅ Performance freq details başarıyla eklendi!");
                    }
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