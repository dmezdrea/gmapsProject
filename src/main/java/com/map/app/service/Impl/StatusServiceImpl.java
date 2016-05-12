package com.map.app.service.Impl;

import com.map.app.DAO.StatusDAO;
import com.map.app.entities.Status;
import com.map.app.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StatusServiceImpl implements StatusService {

    @Autowired
    private StatusDAO statusDAO;

    @Override
    @Transactional
    public List<Status> getStatuses() {
        return statusDAO.getStatuses();
    }

    @Override
    @Transactional
    public Status getStatusById(Integer id) {
        return statusDAO.getStatusById(id);
    }
}
