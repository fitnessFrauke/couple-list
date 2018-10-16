package com.example.list.data;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Frauke Trautmann
 */
public interface ListEntryRepository extends PagingAndSortingRepository<ListEntry, Long> {

}
