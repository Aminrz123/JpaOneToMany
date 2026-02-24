package org.example.jpaonetomanye24a.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class ExceptController {

    @GetMapping("/fileold/{filename}")
    public String getFilenameOld(@PathVariable String filContent) {
        String fileContent = "";
        try {
            FileInputStream fs = new FileInputStream("c:/AFILE/" + fileContent);
            try {
                byte[] bArr = fs.readAllBytes();
                fileContent = new String(bArr);
            } catch (IOException ioException) {
                fileContent = ioException.getMessage();
            } finally {
                //fs.close();
            }

        } catch (FileNotFoundException fileNotFoundException) {
            fileContent = fileNotFoundException.getMessage();
        }
        return fileContent;
    }

    @GetMapping("/file/{filename}")
    public ResponseEntity<String> getFilename(@PathVariable String filename) {
        Path path = Paths.get("C:/AFILE", filename);

        if (!Files.exists(path)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("File not found: " + filename);
        }

        try (FileInputStream fs = new FileInputStream(path.toFile())) {
            byte[] bytes = fs.readAllBytes();
            String fileContent = new String(bytes, StandardCharsets.UTF_8);
            return ResponseEntity.ok(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/div/{divnum1}/{divnum2}")
    public int getdivnum1(@PathVariable int divnum1, @PathVariable int divnum2) {
        int i1 = divnum1 / divnum2;
        return i1;
    }

    @GetMapping("/loop/{loopnum}")
    public int getloopnum(@PathVariable int loopnum) {
        int x = 0;
        for (int i = 0; i < loopnum; i++) {
            x++;
        }
        return x;
    }



}
