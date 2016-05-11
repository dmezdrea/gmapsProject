package com.map.app.controller;

import com.map.app.entities.Status;
import com.map.app.entities.User;
import com.map.app.service.StatusService;
import com.map.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user/")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private StatusService statusService;

    @RequestMapping(value = "/insert", method = RequestMethod.POST)
    public User insert(@RequestBody User user) {
        try {
            User newUser = user;
            Status status = statusService.getStatusById(1);
            newUser.setStatus(status);
            userService.insertUser(newUser);
        } catch (Error e) {
            user.setName(e.toString());
        }
        return user;
    }

    @RequestMapping(value = "/authenticate", method = RequestMethod.POST)
    public User authenticateUser(@RequestBody User user) {
        String userName = user.getUserName();
        String password = user.getPassword();
        User authenticatedUser = userService.getUser(userName, password);
        return authenticatedUser;
    }
}
