package com.map.app.DAO.Impl;

import com.map.app.DAO.UserDAO;
import com.map.app.entities.User;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAOImpl implements UserDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public User getUser(String userName, String password) {
        User user = (User) sessionFactory.getCurrentSession().createCriteria(User.class).add(Restrictions.and(Restrictions.eq("userName", userName), Restrictions.eq("password", password))).uniqueResult();
        return user;
    }

    @Override
    public void insertUser(User user) {
        sessionFactory.getCurrentSession().saveOrUpdate(user);
    }
}
