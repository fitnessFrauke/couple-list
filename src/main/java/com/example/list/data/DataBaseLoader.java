package com.example.list.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Frauke Trautmann
 */
@Component
public class DataBaseLoader implements CommandLineRunner {

    private final ListEntryRepository listEntryRepository;

    @Autowired
    public DataBaseLoader(ListEntryRepository listEntryRepository) {
        this.listEntryRepository = listEntryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        this.listEntryRepository.deleteAll();
        this.listEntryRepository.saveAll(getDemoData());
    }

    private List<ListEntry> getDemoData (){
        List<ListEntry> demoData = new ArrayList<>();
        for(int var = 0; var <= 4; var++) {
            demoData.add(new ListEntry("Test"+ var, false));
        }
        return demoData;
    }
}
