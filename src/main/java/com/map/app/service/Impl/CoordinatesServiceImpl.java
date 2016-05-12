package com.map.app.service.Impl;

import com.map.app.DAO.CoordinatesDAO;
import com.map.app.entities.Coordinates;
import com.map.app.service.CoordinatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CoordinatesServiceImpl implements CoordinatesService {

    @Autowired
    private CoordinatesDAO coordinatesDAO;

    @Override
    @Transactional
    public void insert(Coordinates coordinates) {
        coordinatesDAO.insert(coordinates);
    }

    @Override
    @Transactional
    public List<Coordinates> getAllCoordinates() {
        return coordinatesDAO.getAllCoordinates();
    }


}
