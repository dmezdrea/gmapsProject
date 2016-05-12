package com.map.app.DAO.Impl;

import com.map.app.DAO.CoordinatesDAO;
import com.map.app.entities.Coordinates;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CoordinatesDAOImpl implements CoordinatesDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void insert(Coordinates coordinates) {
        sessionFactory.getCurrentSession().saveOrUpdate(coordinates);
    }

    @Override
    public List<Coordinates> getAllCoordinates() {
        List<Coordinates> coordinatesList = sessionFactory.getCurrentSession().createCriteria(Coordinates.class).list();
        return coordinatesList;
    }
}
