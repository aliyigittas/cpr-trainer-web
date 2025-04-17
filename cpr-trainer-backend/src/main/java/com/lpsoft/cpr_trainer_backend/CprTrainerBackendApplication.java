package com.lpsoft.cpr_trainer_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@SpringBootApplication
public class CprTrainerBackendApplication {

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
}
