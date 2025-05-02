package com.lpsoft.cpr_trainer_backend.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lpsoft.cpr_trainer_backend.Performance;
import com.lpsoft.cpr_trainer_backend.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsernameAndStatus(String username, int status);
    Optional<User> findByEmail(String email);
    Optional<User> findByKhasIDAndStatus(String khasID, int status);
    User getUsernameByKhasID(String khasID);
    Optional<User> findByUsername(String username);
}