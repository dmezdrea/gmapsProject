package com.map.app.DAO;

import com.map.app.entities.Status;

import java.util.List;

public interface StatusDAO {
    public List<Status> getStatuses();

    public Status getStatusById(Integer id);
}
