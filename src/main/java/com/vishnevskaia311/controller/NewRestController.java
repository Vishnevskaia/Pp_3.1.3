package com.vishnevskaia311.controller;

import com.vishnevskaia311.exception.NoSuchUserException;
import com.vishnevskaia311.exception.UserIncorrectData;
import com.vishnevskaia311.model.User;
import com.vishnevskaia311.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api")
public class NewRestController {

    @Autowired
    private UserService userService;

    public NewRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> allUsers = userService.index();
        return new ResponseEntity<>(allUsers, HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        User user = userService.show(id);
        if (user == null) {
            throw new NoSuchUserException("There is no user with id = "
                    + id + " in database");
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/users")
    public User addNewUser(@RequestBody User user){
        userService.save(user);
        return user;
    }

    @PutMapping("/users")
    public User updateUser(@RequestBody User user){
        userService.save(user);
        return user;
    }

    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id){
        User user = userService.show(id);
        if(user==null){
            throw new NoSuchUserException("Tgere is no user with id = "
            + id + " in database");
        }

        userService.delete(id);
        return "User with id= " + id + " was deleted";
    }




}
