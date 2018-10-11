package com.example.list.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Frauke Trautmann
 */
@Controller
public class ListController {

    @RequestMapping(value = "/")
    public String index() {
        return "index";
    }
}
