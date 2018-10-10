package com.example.list.data;

import org.springframework.data.repository.CrudRepository;

/**
 * @author Frauke Trautmann
 */
public interface ListEntryRepository extends CrudRepository<ListEntry, Long> {

}
