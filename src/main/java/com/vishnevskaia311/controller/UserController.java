package com.vishnevskaia311.controller;


import com.vishnevskaia311.model.User;
import com.vishnevskaia311.service.RoleService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import com.vishnevskaia311.service.UserService;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class UserController {

    private final UserService userService;
    private final RoleService roleService;

    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public String userPage(Model model, Principal principal) {
        User user = userService.getUserByName(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }

    @GetMapping()
    public String getPages(Model model, Principal principal) {
        List<User> users = userService.index();
        String username = principal.getName();
        User user = userService.getUserByName(username);
        model.addAttribute("users", users);
        model.addAttribute("user", user);
        model.addAttribute("allroles", roleService.getRoleSet());
//        model.addAttribute("userRoles", user.getRolesToString());
        return "admin";
    }

}
//    private final UserService userService;
//
//    public UserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    @RequestMapping(value = "hello", method = RequestMethod.GET)
//    public String printWelcome(ModelMap model) {
//        List<String> messages = new ArrayList<>();
//        messages.add("Hello!");
//        messages.add("I'm Spring MVC-SECURITY application");
//        messages.add("5.2.0 version by sep'19 ");
//        model.addAttribute("messages", messages);
//        return "hello";
//    }
//
//    @RequestMapping(value = "login", method = RequestMethod.GET)
//    public String loginPage() {
//        return "login";
//    }
//
//    @GetMapping("/user")
//    public String userPage(Model model, Principal principal) {
//        User user = userService.getUserByName(principal.getName());
//        model.addAttribute("user", user);
//        return "user";
//    }
//}