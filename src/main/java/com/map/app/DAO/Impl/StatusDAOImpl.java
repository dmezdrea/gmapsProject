package com.map.app.DAO.Impl;

import com.map.app.DAO.StatusDAO;
import com.map.app.entities.Status;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class StatusDAOImpl implements StatusDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<Status> getStatuses() {
        List<Status> statusList = sessionFactory.getCurrentSession().createCriteria(Status.class).list();
        return statusList;
    }

    @Override
    public Status getStatusById(Integer id) {
        Status status = (Status) sessionFactory.getCurrentSession().createCriteria(Status.class).add(Restrictions.eq("id", id)).uniqueResult();
        return status;
    }
}
