package org.example.jpaonetomanye24a.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.Objects;

@Entity
public class Kommune {

    @Id
    @Column(length = 4)
    private String kode;

    private String navn;
    private String href;

    @Column(length = 1000)
    private String hrefPhoto;

    @ManyToOne
    @JoinColumn(name = "regionfk", referencedColumnName = "kode")
    @JsonBackReference
    private Region region;

    public Kommune() {}

    public Kommune(String kode, String navn) {
        this.kode = kode;
        this.navn = navn;
    }

    public String getKode() { return kode; }
    public void setKode(String kode) { this.kode = kode; }

    public String getNavn() { return navn; }
    public void setNavn(String navn) { this.navn = navn; }

    public String getHref() { return href; }
    public void setHref(String href) { this.href = href; }

    public String getHrefPhoto() { return hrefPhoto; }
    public void setHrefPhoto(String hrefPhoto) { this.hrefPhoto = hrefPhoto; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Kommune kommune = (Kommune) o;
        return Objects.equals(kode, kommune.kode);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(kode);
    }
}