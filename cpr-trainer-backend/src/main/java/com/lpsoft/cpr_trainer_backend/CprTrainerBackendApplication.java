package com.lpsoft.cpr_trainer_backend;

import java.io.IOException;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
@RestController
public class CprTrainerBackendApplication {

    private final DatabaseAdapter databaseAdapter;

    @Autowired
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

    @PostMapping("/performance")
    public String addPerformanceData(@RequestBody String userData) {
        System.out.println("Received performance data: " + userData);
        return "Performance data added successfully!";
    }

    @GetMapping("/createDump")
    public static String createDump() {
        String dumpCommand = "mysqldump --ssl=0 --databases cpr -u cpr-trainer -pcprTrainer123 -h db > /app/dumps/cpr-dump.sql 2> /app/dumps/error.log 1> /app/dumps/output.log";
        try {
            Process process = Runtime.getRuntime().exec(new String[] {"sh", "-c", dumpCommand});
            int exitCode = process.waitFor();  // Bu satırı ekle
            return "Dump alma işlemi bitti. Exit code: " + exitCode;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
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
            } else {
                System.err.println("❌ Kullanıcı eklenirken hata oluştu!");
                return "Error adding user!";
            }
            
            return "User created successfully: " + userData.getFirstname() + " " + userData.getSurname();
        } catch (JsonProcessingException ex) {
            ex.printStackTrace();
            return "Error processing user data!";
        }
    }
}