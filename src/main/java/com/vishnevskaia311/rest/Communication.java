package com.vishnevskaia311.rest;


import com.vishnevskaia311.model.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
public class Communication {

    @Autowired
    private RestTemplate restTemplate;
    private final String URL = "http://localhost:8080/api/users";

    public List<UserDto> getAllUsers(){
        ResponseEntity<List<UserDto>> responseEntity =
                restTemplate.exchange(URL, HttpMethod.GET, null,
                        new ParameterizedTypeReference<List<UserDto>>() {
                        }); //отправляем запрос , его р-т получвем в теле, recponse entity

        List<UserDto> allUsers = responseEntity.getBody();
        return allUsers;
    }

    public UserDto showUser(Long id){

        return null;
    }

    public void saveUser(UserDto user){

    }

    public void deleteUser(Long id){

    }
}
