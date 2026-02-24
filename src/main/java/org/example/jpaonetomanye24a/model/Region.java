package org.example.jpaonetomanye24a.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Region {

    @Id
    @Column(length = 4)
    private String kode;

    private String navn;
    private String href;

    @OneToMany(mappedBy = "region", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Kommune> kommuner = new HashSet<>();

    public String getKode() { return kode; }
    public void setKode(String kode) { this.kode = kode; }

    public String getNavn() { return navn; }
    public void setNavn(String navn) { this.navn = navn; }

    public String getHref() { return href; }
    public void setHref(String href) { this.href = href; }

    public Set<Kommune> getKommuner() { return kommuner; }
    public void setKommuner(Set<Kommune> kommuner) { this.kommuner = kommuner; }
}