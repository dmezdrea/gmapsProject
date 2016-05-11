package com.map.app.service.Impl;

import com.map.app.DAO.UserDAO;
import com.map.app.entities.User;
import com.map.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDAO userDAO;

    @Override
    @Transactional
    public User getUser(String userName, String password) {
        String encryptedPassword = password;
        return userDAO.getUser(userName, encryptedPassword);
    }

    @Override
    @Transactional
    public void insertUser(User user) {
        userDAO.insertUser(user);
    }
}
