package org.example.jpaonetomanye24a.controller;


import org.example.jpaonetomanye24a.exception.ResourceNotFoundException;
import org.example.jpaonetomanye24a.model.Region;
import org.example.jpaonetomanye24a.repositories.RegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class RegionRestController {

    @Autowired
    RegionRepository regionRepository;

    @GetMapping("/regioner")
    public List<Region> getRegioner() {
        List<Region> lstRegioner = regionRepository.findAll();
        return lstRegioner;
    }

    @PostMapping("/region")
    @ResponseStatus(HttpStatus.CREATED)
    public Region postRegion(@RequestBody Region region) {
        System.out.println(region);
        return regionRepository.save(region);
    }

    @PostMapping("/region2")
    public ResponseEntity<String> postRegion2(@RequestParam String kode, @RequestParam String navn) {
        return ResponseEntity.ok("Received kode: " + kode + ", navn: " + navn);
    }

    @GetMapping("/region/name/{name}")
    public Region getRegionByName(@PathVariable String name) {
        var obj = regionRepository.findRegionByNavn(name).orElseThrow(() -> new ResourceNotFoundException("Region ikke fundet med navn =" + name));
        return (Region) obj;
    }





}
