package com.map.app.DAO;


import com.map.app.entities.Coordinates;

import java.util.List;

public interface CoordinatesDAO {
    void insert(Coordinates coordinates);
    void delete(Coordinates coordinates);

    public List<Coordinates> getAllCoordinates();
}
