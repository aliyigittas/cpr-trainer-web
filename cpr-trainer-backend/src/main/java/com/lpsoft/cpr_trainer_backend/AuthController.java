package com.lpsoft.cpr_trainer_backend;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lpsoft.cpr_trainer_backend.interfaces.PerformanceDetailsRepository;
import com.lpsoft.cpr_trainer_backend.interfaces.PerformanceNotesRepository;
import com.lpsoft.cpr_trainer_backend.interfaces.PerformanceRepository;
import com.lpsoft.cpr_trainer_backend.interfaces.PositionDetailsRepository;
import com.lpsoft.cpr_trainer_backend.interfaces.UserRepository;



@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private PerformanceDetailsRepository performanceDetailsRepository;

    @Autowired
    private PerformanceNotesRepository performanceNotesRepository;

    @Autowired
    private PositionDetailsRepository positionDetailsRepository;

    private final DatabaseAdapter databaseAdapter;

    public AuthController(DatabaseAdapter databaseAdapter) {
        this.databaseAdapter = databaseAdapter;
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("{\"message\":\"Bu email ile zaten bir kullanıcı mevcut.\"}");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Kayıt başarılı");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> dbUser = userRepository.findByUsername(user.getUsername());
        if (dbUser.isPresent() && user.getPassword().equals(dbUser.get().getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(Collections.singletonMap("token", "Bearer " + token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı adı veya şifre yanlış");
        }
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

            // Token'ı doğrula
            String username = jwtUtil.extractUsername(token);
            if (username == null) {
                System.out.println("Invalid token.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token.");
            }
            // Kullanıcıyı bul
            Optional<User> userOptional = userRepository.findByUsername(username);
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
                performances = performanceRepository.findAll();
            } else {
                performances = performanceRepository.findByUid(uid);
            }
            //performances = performanceRepository.findByUid(uid);
            if (performances.isEmpty()) {
                System.out.println("No performances found for user ID: " + uid);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(performances);
            }
            // New part: Fetch depth and frequency arrays
            for (Performance perf : performances) {
                List<PerformanceDetails> details = performanceDetailsRepository.findByPerformanceId(perf.getId());
                
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
                List<PositionDetails> position = positionDetailsRepository.findByPerformanceIdOrderByCompressionIdAsc(perf.getId());
                
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
        List<PerformanceNotes> notes = performanceNotesRepository.findByPerformanceid(Integer.parseInt(param));
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
                if(performanceNotesRepository.findByPerformanceidAndType(Integer.parseInt(performanceid), notetype).isEmpty()){ //if the is no instructor note added 
                    databaseAdapter.saveInstructorNote(Integer.parseInt(performanceid), notetype, note);
                }
                else{
                    databaseAdapter.updateInstructorNote(Integer.parseInt(performanceid), notetype, note);
                }
                //TODO: create dump to database
            }
            
        } catch (Exception e) {
            System.err.println("Error occurred while fetching user info: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the request.");
        }

        System.out.println("Performance ID: " + performanceid);
        System.out.println("Instructor Note: " + note);
        
        return ResponseEntity.ok("Instructor note added successfully.");
    }
}