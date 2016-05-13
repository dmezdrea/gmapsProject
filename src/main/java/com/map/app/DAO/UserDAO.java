package com.map.app.DAO;

import com.map.app.entities.User;

public interface UserDAO {
    public User getUser(String userName, String password);

    void insertUser(User user);

    public User getUserByEmail(String email);

    public User getUserByUserName( String userName);
}
