package com.map.app.controller;

import com.map.app.entities.Coordinates;
import com.map.app.service.CoordinatesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/coordinates")
public class CoordinatesController {

	@Autowired
	private CoordinatesService coordinatesService;

	@RequestMapping(value = "/insert", method = RequestMethod.POST)
	public Coordinates insert(@RequestBody Coordinates coordinates) {
		Coordinates newCoordinates = new Coordinates(coordinates.getLatitude(), coordinates.getLongitude(), coordinates.getName(), coordinates.getDescription(), coordinates.getCity(), coordinates.getIcon(), coordinates.getOwner());
//		Coordinates newCoordinates = new Coordinates(coordinates.getLatitude(), coordinates.getLongitude());
		coordinatesService.insert(newCoordinates);
		return newCoordinates;
	}

	@RequestMapping(value = "/delete", method = RequestMethod.DELETE)
	public void delete(@RequestBody Coordinates coordinates) {
		System.out.println(coordinates.toString());
		Coordinates newCoordinates = new Coordinates(coordinates.getId(), coordinates.getLatitude(), coordinates.getLongitude(), coordinates.getName(), coordinates.getDescription(), coordinates.getCity(), coordinates.getIcon(), coordinates.getOwner());
//		Coordinates newCoordinates = new Coordinates(coordinates.getLatitude(), coordinates.getLongitude());
		coordinatesService.delete(newCoordinates);
	}

	@RequestMapping(value = "/all", method = RequestMethod.POST)
	public List<Coordinates> getAllCoordinates() {
		List<Coordinates> coordinatesList = new ArrayList<>();
		try {
			coordinatesList = coordinatesService.getAllCoordinates();
		} catch (Error e) {

		}
		return coordinatesList;
	}

	@RequestMapping(value = "/test", method = RequestMethod.GET)
	public String test() {
		return "{\"test\": \"Merge!\"}";
	}

	public String welcome() {
		return "welcome!";
	}
}