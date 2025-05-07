package com.lpsoft.cpr_trainer_backend;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.couchbase.CouchbaseProperties.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.lpsoft.cpr_trainer_backend.CprTrainerBackendApplication.createDump;



@RestController
@RequestMapping("/auth")
public class AuthController {


    private final DatabaseAdapter databaseAdapter;

    public AuthController(DatabaseAdapter databaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if(databaseAdapter.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\":\"This email is already taken.\"}");
        }
        else if(databaseAdapter.findByUsernameAndStatus(user.getUsername(), 1).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\":\"This username is already taken.\"}");
        }
        else if(!"".equals(user.getKhasID()) && databaseAdapter.findByKhasIDAndStatus(user.getKhasID(), 1).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\":\"This khas id is already taken.\"}");
        }
        databaseAdapter.saveUser(user);
        createDump(); // Call to createDump() after saving the user
        return ResponseEntity.ok("Registration is successful.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> dbUser = databaseAdapter.findByUsernameAndStatus(user.getUsername(), 1);
        Optional<User> dbUserKhas = databaseAdapter.findByKhasIDAndStatus(user.getKhasID(), 1);
        //System.out.println("khas:"+dbUserKhas.get().getFirstname());

        if (dbUser.isPresent() && user.getPassword().equals(dbUser.get().getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            System.out.println(token);
            return ResponseEntity.ok(Collections.singletonMap("token", "Bearer " + token));
        } 
        else if(dbUserKhas.isPresent() && user.getPassword().equals(dbUserKhas.get().getPassword())){
            User userKhas = databaseAdapter.getUsernameByKhasID(user.getKhasID());
            String token = jwtUtil.generateToken(userKhas.getUsername());
            System.out.println(token);
            return ResponseEntity.ok(Collections.singletonMap("token", "Bearer " + token));
        }
        else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username or password is wrong.");
        }
    }

    
    @GetMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "").trim();
        tokenBlacklistService.blacklistToken(token);
        return ResponseEntity.ok("Logout successful.");
    }

    // Kullanıcı bilgilerini dönecek /auth/me endpoint'i
    @GetMapping("/me")
    public ResponseEntity<Object> getUserInfo(@RequestHeader("Authorization") String authHeader) {
        try {
            // Authorization header'ını al
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Authorization header is missing or invalid.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header.");
            }
            // Token'ı header'dan al
            String token = authHeader.substring(7); // "Bearer " kısmını çıkartıyoruz

            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is deactivated.");
            }

            // Token'ı doğrula
            String username = jwtUtil.extractUsername(token);
            if (username == null) {
                System.out.println("Invalid token.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
            }
            // Kullanıcıyı bul
            Optional<User> userOptional = databaseAdapter.findByUsernameAndStatus(username, 1);
            if (userOptional.isEmpty()) {
                System.out.println("User not found.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }
            User user = userOptional.get();
            System.out.println("User found: " + user.getUsername());

            // Kullanıcı bilgilerini döndür
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the token.");
        }
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        // Kullanıcı bilgilerini al
        ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
        if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userInfoResponse.getStatusCode()).body(Collections.emptyList());
        }
        User user = (User) userInfoResponse.getBody();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }
        // Kullanıcı bilgilerini al
        System.out.println("User found: " + user.getUsername());
        // Eğer kullanıcı admin değilse, yetkisiz erişim hatası döndür
        if (!user.getRole().equals("admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList());
        }
        List<User> users = databaseAdapter.findAllUsers();
        System.out.println("Number of users retrieved: " + users.size());
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("changeUserRole/{id}")
    public ResponseEntity<String> changeUserRole(@RequestHeader("Authorization") String authHeader, @PathVariable int id, @RequestBody Map<String, String> body) {
        // Kullanıcı bilgilerini al
        ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
        if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
            return ResponseEntity.status(userInfoResponse.getStatusCode()).body("Unauthorized access");
        }
        User user = (User) userInfoResponse.getBody();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        // Kullanıcı bilgilerini al
        System.out.println("User found: " + user.getUsername());
        // Eğer kullanıcı admin değilse, yetkisiz erişim hatası döndür
        if (!user.getRole().equals("admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
        }
        
        String newRole = body.get("role");
        Optional<User> userToUpdate = databaseAdapter.findById(id);
        
        if (userToUpdate.isPresent()) {
            User userToUpdateObj = userToUpdate.get();
            userToUpdateObj.setRole(newRole);
            databaseAdapter.UpdateUser(userToUpdateObj);
            createDump();
            return ResponseEntity.ok("User role updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @GetMapping("/getPerformance")
    public ResponseEntity<List<Performance>> getPerformance(@RequestHeader("Authorization") String authHeader) {

        //List<Performance> performances = performanceRepository.findAll(); //ilerde admin için yaparız
        List<Performance> performances = Collections.emptyList();
        try {
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(userInfoResponse.getStatusCode()).body(performances);
            }
            User user = (User) userInfoResponse.getBody();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(performances);
            }
            // Kullanıcı bilgilerini al
            System.out.println("User found: " + user.getUsername());

            // Performansları al
            int uid = user.getId();
            if (user.getRole().equals("instructor")) {
                performances = databaseAdapter.findAllByStatus(1);
            } else {
                performances = databaseAdapter.findByUidAndStatus(uid, 1);
            }
            
            //performances = performanceRepository.findByUid(uid);
            if (performances.isEmpty()) {
                System.out.println("No performances found for user ID: " + uid);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(performances);
            }
            // New part: Fetch depth and frequency arrays
            for (Performance perf : performances) {
                List<PerformanceDetails> details = databaseAdapter.findByPerformanceId(perf.getId());
                
                List<Double> depthArray = new ArrayList<>();
                List<Double> freqArray = new ArrayList<>();
                
                for (PerformanceDetails detail : details) {
                    if ("D".equals(detail.getDetailType())) {
                        depthArray.add(detail.getVal());
                    } else if ("F".equals(detail.getDetailType())) {
                        freqArray.add(detail.getVal());
                    }
                }

                perf.setDepthArray(depthArray);
                perf.setFreqArray(freqArray);
            }

            for (Performance perf : performances) {
                List<PositionDetails> position = databaseAdapter.findByPerformanceIdOrderByCompressionIdAsc(perf.getId());
                
                List<Double> positionScore = new ArrayList<>();
                
                for (PositionDetails detail : position) {
                    positionScore.add(detail.getVal()*100);
                }

                perf.setPositionArray(positionScore);
            }

            System.out.println("Performances with arrays: " + performances);
            System.out.println("Performances: " + performances);

        } catch (Exception e) {
            System.err.println("Error occurred while fetching performances: " + e.getMessage());
        }
        return ResponseEntity.ok(performances);
    }
    

    @GetMapping("/getPerformanceNotes")
    public List<PerformanceNotes> getPerformanceNotes(@RequestHeader("Authorization") String authHeader, @RequestParam String param) {
        System.out.println("Performance ID: " + param);
        List<PerformanceNotes> notes = databaseAdapter.findByPerformanceid(Integer.parseInt(param));
        //take only message and sentiment part in note, it is stored in json format, parse it and return
        return notes;
    }
    

    @PostMapping("/saveInstructorNote")
    public ResponseEntity<String> saveInstructorNote(@RequestHeader("Authorization") String authHeader, @RequestBody Map<String, String> body) {
        
        String performanceid = body.get("performanceid");
        String note = body.get("note");
        String notetype = body.get("notetype");

        try {
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            User user = (User) userInfoResponse.getBody();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }
            else {
                // Kullanıcı bilgilerini al
                System.out.println("User found: " + user.getUsername());
                if (!user.getRole().equals("instructor")) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only instructors can add notes.");
                }
                if(databaseAdapter.findByPerformanceidAndNotetype(Integer.parseInt(performanceid), notetype).isEmpty()){ //if the is no instructor note added 
                    databaseAdapter.saveInstructorNote(Integer.parseInt(performanceid), notetype, note);
                }
                else{
                    databaseAdapter.updateInstructorNote(Integer.parseInt(performanceid), notetype, note);
                }
                //TODO: create dump to database
                createDump();
            }
            
        } catch (Exception e) {
            System.err.println("Error occurred while fetching user info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request.");
        }

        System.out.println("Performance ID: " + performanceid);
        System.out.println("Instructor Note: " + note);
        
        return ResponseEntity.ok("Instructor note added successfully.");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestHeader("Authorization") String authHeader, 
                                            @RequestBody Map<String, String> passwordData) {
        try {
            // Token'dan kullanıcı bilgisini al
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(userInfoResponse.getStatusCode()).body("Unauthorized access");
            }
            
            User user = (User) userInfoResponse.getBody();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            // İstek içindeki mevcut ve yeni şifreleri al
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            // Mevcut şifreyi doğrula
            if (!currentPassword.equals(user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
            }
            
            // Şifreyi güncelle
            user.setPassword(newPassword);
            databaseAdapter.UpdateUser(user);
            createDump(); // Call to createDump() after updating the password
            
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @PostMapping("/update-username")
    public ResponseEntity<String> updateUsername(@RequestHeader("Authorization") String authHeader, 
                                            @RequestBody Map<String, String> userData) {
        try {
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            if (userInfoResponse.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.status(userInfoResponse.getStatusCode()).body("Unauthorized access");
            }
            
            User user = (User) userInfoResponse.getBody();
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }
            
            String newUsername = userData.get("username");
            
            // Validate username
            if (newUsername == null || newUsername.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username cannot be empty");
            }
            
            // Check if username is already taken
            Optional<User> existingUser = databaseAdapter.findByUsernameAndStatus(newUsername, 1);
            if (existingUser.isPresent() && existingUser.get().getId() != user.getId()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already taken");
            }
            
            // Update username
            user.setUsername(newUsername);
            System.out.println("new username:"+newUsername);
            if(databaseAdapter.UpdateUser(user)){
                createDump(); // Call to createDump() after updating the username
                String newToken = jwtUtil.generateToken(newUsername);
                System.out.println("new token:"+newToken);
            // Return response with new token
                return ResponseEntity.ok()
                        .header("Authorization", "Bearer " + newToken) // Send the new token back in the header
                        .body("Username updated successfully");
            }
            else{
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: ");
            }
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/getUsername")
    public ResponseEntity<String> getUsername(@RequestParam("uid") Integer uid, @RequestHeader("Authorization") String authHeader) {
        try {
            // Fetch user info (authentication)
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            User user = (User) userInfoResponse.getBody();
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }
            
            // Fetch the username based on the provided uid
            Optional<User> userDetails = databaseAdapter.findById(uid);
            
            if (userDetails.isPresent()) {
                String username = userDetails.get().getUsername();
                System.out.println("username:" + username);
                return ResponseEntity.ok(username);  // Return the username
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Username not found for the given UID.");
            }
        } catch (Exception e) {
            System.err.println("Error occurred while fetching user info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request.");
        }
    }

    @PostMapping("/deleteAccount")
    public ResponseEntity<String> deleteAccount(@RequestParam("uid") int uid, @RequestHeader("Authorization") String authHeader) {
        try {
            // Fetch user info (authentication)
            ResponseEntity<Object> userInfoResponse = getUserInfo(authHeader);
            User user = (User) userInfoResponse.getBody();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found.");
            }

            // Call your service or DB logic to deactivate the account
            if(databaseAdapter.deactivateUser(uid)){
                if(databaseAdapter.deactivatePerformances(uid)){
                    createDump(); // Call to createDump() after deactivating the account
                    return ResponseEntity.ok("Account deactivated successfully.");
                }
                else {
                    createDump(); // Call to createDump() after deactivating the account
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Performance not found or already deactivated.");
                }
            }
            else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found or already deactivated.");
            }
        } catch (Exception e) {
            System.err.println("Error occurred while deleting account: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request.");
        }
    }
}