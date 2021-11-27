package com.vishnevskaia311.controller;

import com.vishnevskaia311.model.User;
import com.vishnevskaia311.service.RoleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

import com.vishnevskaia311.service.UserService;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public String getPages(Model model, Principal principal) {
        List<User> users = userService.index();
        String username = principal.getName();
        User user = userService.getUserByName(username);
        model.addAttribute("users", users);
        model.addAttribute("user", user);
        model.addAttribute("allroles", roleService.getRoleSet());
        return "admin";
    }
}
