package com.example.list.data;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.io.Serializable;


/**
 * @author Frauke Trautmann
 */
@Entity
@Data
public class ListEntry implements Serializable {

    private static final long serialVersionUID = -3009157732242241606L;

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;
    private String check;

    private ListEntry() {}

    public ListEntry(String name, String check) {
        this.name = name;
        this.check = check;
    }
}
