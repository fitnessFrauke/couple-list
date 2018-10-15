package com.example.list.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

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
        this.listEntryRepository.save(new ListEntry("Test", false));
        this.listEntryRepository.save(new ListEntry("Test1", false));
        this.listEntryRepository.save(new ListEntry("Test2", false));
        this.listEntryRepository.save(new ListEntry("Test3", false));
        this.listEntryRepository.save(new ListEntry("Test4", false));
    }
}
